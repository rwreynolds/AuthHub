# app/embedded_apps/models.py
from pydantic import BaseModel
from typing import List, Optional

class EmbeddedApp(BaseModel):
    id: str
    name: str
    description: str
    url: str
    icon: str