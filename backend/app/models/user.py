from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    RESEARCHER = "researcher"
    CITIZEN = "citizen"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    username: Optional[str] = Field(None, min_length=3, max_length=50)
    role: UserRole = UserRole.CITIZEN
    bio: Optional[str] = Field(None, max_length=500)
    location: Optional[str] = Field(None, max_length=100)
    avatar_url: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=6)

class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    bio: Optional[str] = Field(None, max_length=500)
    location: Optional[str] = Field(None, max_length=100)
    avatar_url: Optional[str] = None

class UserInDB(UserBase):
    id: str
    password_hash: str  # Mudado de hashed_password para password_hash
    created_at: datetime
    updated_at: datetime
    observation_count: int = 0
    validation_count: int = 0
    points: int = 0
    level: int = 1
    last_login: Optional[datetime] = None

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    observation_count: int = 0
    validation_count: int = 0
    points: int = 0
    level: int = 1
    last_login: Optional[datetime] = None

class UserProfile(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: UserRole
    bio: Optional[str]
    location: Optional[str]
    avatar_url: Optional[str]
    created_at: datetime
    observation_count: int
    validation_count: int
    points: int
    level: int
    achievements: List[str] = []

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class RegisterRequest(UserCreate):
    pass

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

class SocialLoginRequest(BaseModel):
    provider: str = Field(..., pattern="^(google|facebook|github)$")
    access_token: str
    
class UserStats(BaseModel):
    total_observations: int
    total_validations: int
    points: int
    level: int
    rank: Optional[int] = None
    achievements_count: int
    areas_monitored: int
    recent_activity: List[dict] = []