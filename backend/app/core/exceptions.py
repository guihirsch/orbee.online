from fastapi import HTTPException, status

class OrBeeException(Exception):
    """Exceção base para o OrBee.Online"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class UserNotFoundError(OrBeeException):
    """Usuário não encontrado"""
    def __init__(self, message: str = "Usuário não encontrado"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

class UserAlreadyExistsError(OrBeeException):
    """Usuário já existe"""
    def __init__(self, message: str = "Usuário já existe"):
        super().__init__(message, status.HTTP_409_CONFLICT)

class InvalidCredentialsError(OrBeeException):
    """Credenciais inválidas"""
    def __init__(self, message: str = "Email ou senha incorretos"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class TokenExpiredError(OrBeeException):
    """Token expirado"""
    def __init__(self, message: str = "Token expirado"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class InvalidTokenError(OrBeeException):
    """Token inválido"""
    def __init__(self, message: str = "Token inválido"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class InsufficientPermissionsError(OrBeeException):
    """Permissões insuficientes"""
    def __init__(self, message: str = "Permissões insuficientes"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)

class ValidationError(OrBeeException):
    """Erro de validação de dados"""
    def __init__(self, message: str = "Dados inválidos"):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY)

class ObservationNotFoundError(OrBeeException):
    """Observação não encontrada"""
    def __init__(self, message: str = "Observação não encontrada"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

class NDVIServiceError(OrBeeException):
    """Erro no serviço NDVI"""
    def __init__(self, message: str = "Erro ao obter dados NDVI"):
        super().__init__(message, status.HTTP_503_SERVICE_UNAVAILABLE)

class FileUploadError(OrBeeException):
    """Erro no upload de arquivo"""
    def __init__(self, message: str = "Erro no upload do arquivo"):
        super().__init__(message, status.HTTP_400_BAD_REQUEST)

class DatabaseError(OrBeeException):
    """Erro de banco de dados"""
    def __init__(self, message: str = "Erro interno do servidor"):
        super().__init__(message, status.HTTP_500_INTERNAL_SERVER_ERROR)

# Função para converter exceções personalizadas em HTTPException
def to_http_exception(exc: OrBeeException) -> HTTPException:
    """Converte exceção personalizada em HTTPException do FastAPI"""
    return HTTPException(
        status_code=exc.status_code,
        detail=exc.message
    )