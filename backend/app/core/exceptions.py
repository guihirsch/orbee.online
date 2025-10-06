from fastapi import HTTPException, status

class OrBeeException(Exception):
    """Base exception for OrBee.Online"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class UserNotFoundError(OrBeeException):
    """User not found"""
    def __init__(self, message: str = "User not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

class UserAlreadyExistsError(OrBeeException):
    """User already exists"""
    def __init__(self, message: str = "User already exists"):
        super().__init__(message, status.HTTP_409_CONFLICT)

class InvalidCredentialsError(OrBeeException):
    """Invalid credentials"""
    def __init__(self, message: str = "Incorrect email or password"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class TokenExpiredError(OrBeeException):
    """Token expired"""
    def __init__(self, message: str = "Token expired"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class InvalidTokenError(OrBeeException):
    """Invalid token"""
    def __init__(self, message: str = "Invalid token"):
        super().__init__(message, status.HTTP_401_UNAUTHORIZED)

class InsufficientPermissionsError(OrBeeException):
    """Insufficient permissions"""
    def __init__(self, message: str = "Insufficient permissions"):
        super().__init__(message, status.HTTP_403_FORBIDDEN)

class ValidationError(OrBeeException):
    """Data validation error"""
    def __init__(self, message: str = "Invalid data"):
        super().__init__(message, status.HTTP_422_UNPROCESSABLE_ENTITY)

class ObservationNotFoundError(OrBeeException):
    """Observation not found"""
    def __init__(self, message: str = "Observation not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

class ValidationNotFoundError(OrBeeException):
    """Validation not found"""
    def __init__(self, message: str = "Validation not found"):
        super().__init__(message, status.HTTP_404_NOT_FOUND)

class NDVIServiceError(OrBeeException):
    """NDVI service error"""
    def __init__(self, message: str = "Error getting NDVI data"):
        super().__init__(message, status.HTTP_503_SERVICE_UNAVAILABLE)

class FileUploadError(OrBeeException):
    """File upload error"""
    def __init__(self, message: str = "File upload error"):
        super().__init__(message, status.HTTP_400_BAD_REQUEST)

class DatabaseError(OrBeeException):
    """Database error"""
    def __init__(self, message: str = "Internal server error"):
        super().__init__(message, status.HTTP_500_INTERNAL_SERVER_ERROR)

# Function to convert custom exceptions to HTTPException
def to_http_exception(exc: OrBeeException) -> HTTPException:
    """Converts custom exception to FastAPI HTTPException"""
    return HTTPException(
        status_code=exc.status_code,
        detail=exc.message
    )