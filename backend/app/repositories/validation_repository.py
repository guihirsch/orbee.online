from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from supabase import Client
import logging

from app.models.observation import (
    Validation,
    ValidationCreate,
    ValidationUpdate,
    ValidationInDB,
    ValidationStats,
    ValidationStatus
)
from app.core.exceptions import (
    ValidationError,
    DatabaseError,
    ObservationNotFoundError
)

logger = logging.getLogger(__name__)


class ValidationRepository:
    """Repositório para operações de validações no banco de dados"""
    
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.validations_table = "observation_validations"
        self.observations_table = "observations"
        self.users_table = "users"
    
    async def create_validation(self, validation_data: ValidationCreate, user_id: str) -> ValidationInDB:
        """Cria nova validação"""
        try:
            # Verificar se a observação existe
            obs_check = self.supabase.table(self.observations_table).select("id, user_id").eq(
                "id", validation_data.observation_id
            ).execute()
            
            if not obs_check.data:
                raise ObservationNotFoundError("Observação não encontrada")
            
            # Verificar se o usuário não é o autor da observação
            if obs_check.data[0]["user_id"] == user_id:
                raise ValidationError("Não é possível validar sua própria observação")
            
            # Verificar se o usuário já validou esta observação
            existing_validation = self.supabase.table(self.validations_table).select("id").eq(
                "observation_id", validation_data.observation_id
            ).eq("user_id", user_id).execute()
            
            if existing_validation.data:
                raise ValidationError("Usuário já validou esta observação")
            
            # Preparar dados para inserção
            insert_data = {
                "observation_id": validation_data.observation_id,
                "user_id": user_id,
                "status": validation_data.status.value,
                "comment": validation_data.comment,
                "confidence_level": validation_data.confidence_level,
                "evidence_images": validation_data.evidence_images or []
            }
            
            result = self.supabase.table(self.validations_table).insert(insert_data).execute()
            
            if not result.data:
                raise DatabaseError("Falha ao criar validação")
            
            # Atualizar contadores na observação
            await self._update_observation_validation_counts(validation_data.observation_id)
            
            return ValidationInDB(**result.data[0])
            
        except (ObservationNotFoundError, ValidationError):
            raise
        except Exception as e:
            logger.error(f"Erro ao criar validação: {e}")
            raise DatabaseError(f"Erro ao criar validação: {str(e)}")
    
    async def get_validation_by_id(self, validation_id: str) -> Validation:
        """Busca validação por ID"""
        try:
            query = self.supabase.table(self.validations_table).select(
                "*, users(name, avatar_url, level)"
            ).eq("id", validation_id)
            
            result = query.execute()
            
            if not result.data:
                raise ValidationError(f"Validação {validation_id} não encontrada")
            
            val_data = result.data[0]
            
            validation = Validation(
                **val_data,
                user_name=val_data.get("users", {}).get("name") if val_data.get("users") else None,
                user_avatar=val_data.get("users", {}).get("avatar_url") if val_data.get("users") else None,
                user_level=val_data.get("users", {}).get("level") if val_data.get("users") else None
            )
            
            return validation
            
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Erro ao buscar validação {validation_id}: {e}")
            raise DatabaseError(f"Erro ao buscar validação: {str(e)}")
    
    async def get_validations_by_observation(self, observation_id: str) -> List[Validation]:
        """Busca todas as validações de uma observação"""
        try:
            query = self.supabase.table(self.validations_table).select(
                "*, users(name, avatar_url, level)"
            ).eq("observation_id", observation_id).order("created_at", desc=True)
            
            result = query.execute()
            
            validations = []
            for val_data in result.data:
                validation = Validation(
                    **val_data,
                    user_name=val_data.get("users", {}).get("name") if val_data.get("users") else None,
                    user_avatar=val_data.get("users", {}).get("avatar_url") if val_data.get("users") else None,
                    user_level=val_data.get("users", {}).get("level") if val_data.get("users") else None
                )
                validations.append(validation)
            
            return validations
            
        except Exception as e:
            logger.error(f"Erro ao buscar validações da observação {observation_id}: {e}")
            raise DatabaseError(f"Erro ao buscar validações: {str(e)}")
    
    async def get_validations_by_user(
        self, 
        user_id: str, 
        skip: int = 0, 
        limit: int = 20
    ) -> List[Validation]:
        """Busca validações de um usuário"""
        try:
            query = self.supabase.table(self.validations_table).select(
                "*, observations(title, observation_type)"
            ).eq("user_id", user_id).order("created_at", desc=True).range(skip, skip + limit - 1)
            
            result = query.execute()
            
            validations = []
            for val_data in result.data:
                validation = Validation(**val_data)
                validations.append(validation)
            
            return validations
            
        except Exception as e:
            logger.error(f"Erro ao buscar validações do usuário {user_id}: {e}")
            raise DatabaseError(f"Erro ao buscar validações: {str(e)}")
    
    async def update_validation(
        self, 
        validation_id: str, 
        validation_data: ValidationUpdate, 
        user_id: str
    ) -> Validation:
        """Atualiza validação (apenas o autor pode atualizar)"""
        try:
            # Verificar se a validação existe e pertence ao usuário
            existing = await self.get_validation_by_id(validation_id)
            if existing.user_id != user_id:
                raise ValidationError("Apenas o autor pode atualizar a validação")
            
            # Preparar dados para atualização
            update_data = {}
            if validation_data.status is not None:
                update_data["status"] = validation_data.status.value
            if validation_data.comment is not None:
                update_data["comment"] = validation_data.comment
            if validation_data.confidence_level is not None:
                update_data["confidence_level"] = validation_data.confidence_level
            if validation_data.evidence_images is not None:
                update_data["evidence_images"] = validation_data.evidence_images
            
            if not update_data:
                return existing
            
            update_data["updated_at"] = datetime.utcnow().isoformat()
            
            result = self.supabase.table(self.validations_table).update(update_data).eq(
                "id", validation_id
            ).execute()
            
            if not result.data:
                raise DatabaseError("Falha ao atualizar validação")
            
            # Atualizar contadores na observação se o status mudou
            if "status" in update_data:
                await self._update_observation_validation_counts(existing.observation_id)
            
            return await self.get_validation_by_id(validation_id)
            
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Erro ao atualizar validação {validation_id}: {e}")
            raise DatabaseError(f"Erro ao atualizar validação: {str(e)}")
    
    async def delete_validation(self, validation_id: str, user_id: str) -> bool:
        """Remove validação (apenas o autor pode remover)"""
        try:
            # Verificar se a validação existe e pertence ao usuário
            existing = await self.get_validation_by_id(validation_id)
            if existing.user_id != user_id:
                raise ValidationError("Apenas o autor pode remover a validação")
            
            result = self.supabase.table(self.validations_table).delete().eq(
                "id", validation_id
            ).execute()
            
            # Atualizar contadores na observação
            await self._update_observation_validation_counts(existing.observation_id)
            
            return len(result.data) > 0
            
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Erro ao remover validação {validation_id}: {e}")
            raise DatabaseError(f"Erro ao remover validação: {str(e)}")
    
    async def get_validation_stats(self, user_id: Optional[str] = None) -> ValidationStats:
        """Obtém estatísticas de validações"""
        try:
            query = self.supabase.table(self.validations_table).select(
                "status, confidence_level, user_id, users(name)"
            )
            
            if user_id:
                query = query.eq("user_id", user_id)
            
            result = query.execute()
            
            total = len(result.data)
            confirmed = len([val for val in result.data if val["status"] == ValidationStatus.CONFIRMED.value])
            disputed = len([val for val in result.data if val["status"] == ValidationStatus.DISPUTED.value])
            
            # Calcular confiança média
            if total > 0:
                avg_confidence = sum(val["confidence_level"] for val in result.data) / total
            else:
                avg_confidence = 0.0
            
            # Contar validações por usuário
            validations_by_user = {}
            for val in result.data:
                user_name = val.get("users", {}).get("name", "Usuário Anônimo") if val.get("users") else "Usuário Anônimo"
                validations_by_user[user_name] = validations_by_user.get(user_name, 0) + 1
            
            return ValidationStats(
                total_validations=total,
                confirmed_validations=confirmed,
                disputed_validations=disputed,
                average_confidence=round(avg_confidence, 2),
                validations_by_user=validations_by_user
            )
            
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas de validações: {e}")
            raise DatabaseError(f"Erro ao obter estatísticas: {str(e)}")
    
    async def _update_observation_validation_counts(self, observation_id: str):
        """Atualiza contadores de validação na observação"""
        try:
            # Contar validações por status
            validations = self.supabase.table(self.validations_table).select("status").eq(
                "observation_id", observation_id
            ).execute()
            
            total_validations = len(validations.data)
            confirmed_validations = len([
                val for val in validations.data 
                if val["status"] == ValidationStatus.CONFIRMED.value
            ])
            disputed_validations = len([
                val for val in validations.data 
                if val["status"] == ValidationStatus.DISPUTED.value
            ])
            
            # Determinar status da observação baseado nas validações
            observation_status = "pending"
            if total_validations >= 3:  # Mínimo de 3 validações
                if confirmed_validations >= (total_validations * 0.7):  # 70% confirmadas
                    observation_status = "validated"
                elif disputed_validations >= (total_validations * 0.7):  # 70% disputadas
                    observation_status = "rejected"
                else:
                    observation_status = "under_review"
            
            # Atualizar observação
            update_data = {
                "validation_count": total_validations,
                "confirmed_validations": confirmed_validations,
                "disputed_validations": disputed_validations,
                "status": observation_status,
                "updated_at": datetime.utcnow().isoformat()
            }
            
            self.supabase.table(self.observations_table).update(update_data).eq(
                "id", observation_id
            ).execute()
            
        except Exception as e:
            logger.error(f"Erro ao atualizar contadores de validação: {e}")
            # Não propagar erro para não quebrar o fluxo principal
    
    async def check_user_can_validate(self, observation_id: str, user_id: str) -> bool:
        """Verifica se o usuário pode validar uma observação"""
        try:
            # Verificar se a observação existe
            obs_check = self.supabase.table(self.observations_table).select("user_id").eq(
                "id", observation_id
            ).execute()
            
            if not obs_check.data:
                return False
            
            # Verificar se não é o autor
            if obs_check.data[0]["user_id"] == user_id:
                return False
            
            # Verificar se já validou
            validation_check = self.supabase.table(self.validations_table).select("id").eq(
                "observation_id", observation_id
            ).eq("user_id", user_id).execute()
            
            return len(validation_check.data) == 0
            
        except Exception as e:
            logger.error(f"Erro ao verificar permissão de validação: {e}")
            return False