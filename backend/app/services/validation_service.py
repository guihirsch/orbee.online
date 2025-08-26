from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import logging

from app.models.observation import (
    Validation,
    ValidationCreate,
    ValidationUpdate,
    ValidationStats,
    ValidationStatus
)
from app.models.validation import ValidationSummary
from app.repositories.validation_repository import ValidationRepository
from app.repositories.observation_repository import ObservationRepository
from app.core.exceptions import (
    ValidationError,
    ObservationNotFoundError,
    DatabaseError
)
from app.core.config import settings

logger = logging.getLogger(__name__)


class ValidationService:
    """Serviço para lógica de negócio das validações"""
    
    def __init__(
        self, 
        validation_repo: ValidationRepository,
        observation_repo: ObservationRepository
    ):
        self.validation_repo = validation_repo
        self.observation_repo = observation_repo
    
    async def create_validation(
        self, 
        validation_data: ValidationCreate, 
        user_id: str
    ) -> Validation:
        """Cria nova validação"""
        try:
            # Validar dados específicos
            await self._validate_validation_data(validation_data, user_id)
            
            # Criar validação
            validation_in_db = await self.validation_repo.create_validation(
                validation_data, user_id
            )
            
            # Buscar validação completa com dados do usuário
            validation = await self.validation_repo.get_validation_by_id(
                validation_in_db.id
            )
            
            logger.info(f"Validação criada: {validation.id} por usuário {user_id}")
            return validation
            
        except (ValidationError, ObservationNotFoundError):
            raise
        except Exception as e:
            logger.error(f"Erro ao criar validação: {e}")
            raise DatabaseError(f"Erro ao criar validação: {str(e)}")
    
    async def get_validation_by_id(self, validation_id: str) -> Validation:
        """Busca validação por ID"""
        try:
            return await self.validation_repo.get_validation_by_id(validation_id)
            
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Erro ao buscar validação {validation_id}: {e}")
            raise DatabaseError(f"Erro ao buscar validação: {str(e)}")
    
    async def get_validations_by_observation(
        self, 
        observation_id: str
    ) -> List[Validation]:
        """Busca todas as validações de uma observação"""
        try:
            return await self.validation_repo.get_validations_by_observation(
                observation_id
            )
            
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
            return await self.validation_repo.get_validations_by_user(
                user_id, skip, limit
            )
            
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
            # Validar novos dados se fornecidos
            if validation_data.dict(exclude_unset=True):
                await self._validate_validation_update(validation_data)
            
            validation = await self.validation_repo.update_validation(
                validation_id, validation_data, user_id
            )
            
            logger.info(f"Validação atualizada: {validation_id} por usuário {user_id}")
            return validation
            
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Erro ao atualizar validação {validation_id}: {e}")
            raise DatabaseError(f"Erro ao atualizar validação: {str(e)}")
    
    async def delete_validation(self, validation_id: str, user_id: str) -> bool:
        """Remove validação (apenas o autor pode remover)"""
        try:
            success = await self.validation_repo.delete_validation(
                validation_id, user_id
            )
            
            if success:
                logger.info(f"Validação removida: {validation_id} por usuário {user_id}")
            
            return success
            
        except ValidationError:
            raise
        except Exception as e:
            logger.error(f"Erro ao remover validação {validation_id}: {e}")
            raise DatabaseError(f"Erro ao remover validação: {str(e)}")
    
    async def get_validation_stats(
        self, 
        user_id: Optional[str] = None
    ) -> ValidationStats:
        """Obtém estatísticas de validações"""
        try:
            return await self.validation_repo.get_validation_stats(user_id)
            
        except Exception as e:
            logger.error(f"Erro ao obter estatísticas de validações: {e}")
            raise DatabaseError(f"Erro ao obter estatísticas: {str(e)}")
    
    async def check_user_can_validate(
        self, 
        observation_id: str, 
        user_id: str
    ) -> bool:
        """Verifica se o usuário pode validar uma observação"""
        try:
            return await self.validation_repo.check_user_can_validate(
                observation_id, user_id
            )
            
        except Exception as e:
            logger.error(f"Erro ao verificar permissão de validação: {e}")
            return False
    
    async def get_recent_validations(
        self, 
        days: int = 7, 
        limit: int = 20
    ) -> List[Validation]:
        """Busca validações recentes"""
        try:
            # Buscar todas as validações recentes (simplificado)
            # Em uma implementação mais robusta, isso seria feito no repositório
            validations = await self.validation_repo.get_validations_by_user(
                user_id="",  # Buscar todas
                skip=0,
                limit=limit * 5  # Buscar mais para filtrar por data
            )
            
            # Filtrar por data
            since_date = datetime.utcnow() - timedelta(days=days)
            recent_validations = [
                val for val in validations 
                if val.created_at >= since_date
            ]
            
            # Ordenar por data e limitar
            recent_validations.sort(key=lambda x: x.created_at, reverse=True)
            return recent_validations[:limit]
            
        except Exception as e:
            logger.error(f"Erro ao buscar validações recentes: {e}")
            raise DatabaseError(f"Erro ao buscar validações recentes: {str(e)}")
    
    async def get_validation_summary(self) -> ValidationSummary:
        """Obtém resumo geral das validações do sistema"""
        try:
            # Obter estatísticas gerais
            stats = await self.validation_repo.get_validation_stats()
            
            # Calcular percentuais
            total = stats.total_validations
            confirmed_percentage = (stats.confirmed_validations / total * 100) if total > 0 else 0
            disputed_percentage = (stats.disputed_validations / total * 100) if total > 0 else 0
            
            # Buscar validações recentes (últimos 7 dias)
            recent_validations = await self.get_recent_validations(days=7, limit=100)
            recent_count = len(recent_validations)
            
            # Top validadores (simplificado)
            top_validators = []
            for user_id, count in list(stats.validations_by_user.items())[:5]:
                top_validators.append({
                    "user_id": user_id,
                    "validation_count": count
                })
            
            # Tendências por dia (simplificado)
            validation_trends = {}
            for i in range(7):
                date_key = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
                validation_trends[date_key] = 0  # Simplificado
            
            return ValidationSummary(
                total_validations=total,
                recent_validations=recent_count,
                confirmed_percentage=round(confirmed_percentage, 2),
                disputed_percentage=round(disputed_percentage, 2),
                average_confidence=stats.average_confidence,
                top_validators=top_validators,
                validation_trends=validation_trends
            )
            
        except Exception as e:
            logger.error(f"Erro ao obter resumo geral de validações: {e}")
            raise DatabaseError(f"Erro ao obter resumo: {str(e)}")
    
    async def get_observation_validation_summary(
        self, 
        observation_id: str
    ) -> Dict[str, Any]:
        """Obtém resumo das validações de uma observação"""
        try:
            validations = await self.get_validations_by_observation(observation_id)
            
            total = len(validations)
            confirmed = len([val for val in validations if val.status == ValidationStatus.CONFIRMED])
            disputed = len([val for val in validations if val.status == ValidationStatus.DISPUTED])
            
            # Calcular confiança média
            if total > 0:
                avg_confidence = sum(val.confidence_level for val in validations) / total
            else:
                avg_confidence = 0.0
            
            # Determinar status geral
            if total >= 3:  # Mínimo de 3 validações
                if confirmed >= (total * 0.7):  # 70% confirmadas
                    overall_status = "validated"
                elif disputed >= (total * 0.7):  # 70% disputadas
                    overall_status = "rejected"
                else:
                    overall_status = "under_review"
            else:
                overall_status = "pending"
            
            return {
                "total_validations": total,
                "confirmed_validations": confirmed,
                "disputed_validations": disputed,
                "average_confidence": round(avg_confidence, 2),
                "overall_status": overall_status,
                "validations": validations
            }
            
        except Exception as e:
            logger.error(f"Erro ao obter resumo de validações: {e}")
            raise DatabaseError(f"Erro ao obter resumo: {str(e)}")
    
    async def _validate_validation_data(
        self, 
        validation_data: ValidationCreate, 
        user_id: str
    ):
        """Valida dados da validação"""
        # Verificar se o usuário pode validar esta observação
        can_validate = await self.check_user_can_validate(
            validation_data.observation_id, user_id
        )
        
        if not can_validate:
            raise ValidationError(
                "Você não pode validar esta observação (já validou ou é o autor)"
            )
        
        # Validar nível de confiança
        if not (0.0 <= validation_data.confidence_level <= 1.0):
            raise ValidationError("Nível de confiança deve estar entre 0.0 e 1.0")
        
        # Validar comentário se fornecido
        if validation_data.comment and len(validation_data.comment.strip()) < 5:
            raise ValidationError("Comentário deve ter pelo menos 5 caracteres")
        
        # Validar imagens de evidência (máximo 3)
        if validation_data.evidence_images and len(validation_data.evidence_images) > 3:
            raise ValidationError("Máximo de 3 imagens de evidência por validação")
    
    async def _validate_validation_update(self, validation_data: ValidationUpdate):
        """Valida dados de atualização da validação"""
        # Validar nível de confiança se fornecido
        if validation_data.confidence_level is not None:
            if not (0.0 <= validation_data.confidence_level <= 1.0):
                raise ValidationError("Nível de confiança deve estar entre 0.0 e 1.0")
        
        # Validar comentário se fornecido
        if validation_data.comment and len(validation_data.comment.strip()) < 5:
            raise ValidationError("Comentário deve ter pelo menos 5 caracteres")
        
        # Validar imagens de evidência se fornecidas
        if validation_data.evidence_images and len(validation_data.evidence_images) > 3:
            raise ValidationError("Máximo de 3 imagens de evidência por validação")