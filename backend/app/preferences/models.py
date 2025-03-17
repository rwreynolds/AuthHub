# app/preferences/models.py
from pydantic import BaseModel
from typing import Optional

class UserPreference(BaseModel):
    user_id: int
    preferred_app: str
    theme: Optional[str] = "light"
    language: Optional[str] = "en"

class UpdatePreference(BaseModel):
    preferred_app: Optional[str] = None
    theme: Optional[str] = None
    language: Optional[str] = None