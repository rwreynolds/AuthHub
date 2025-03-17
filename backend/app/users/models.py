# app/users/models.py
from pydantic import BaseModel, EmailStr
from typing import Optional

class UserProfile(BaseModel):
    id: int
    username: str
    email: EmailStr
    display_name: Optional[str] = None
    avatar: Optional[str] = None

class UserProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    avatar: Optional[str] = None