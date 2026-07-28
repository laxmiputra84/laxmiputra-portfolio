from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SkillBase(BaseModel):
    name: str
    category: str
    level: int = Field(..., ge=0, le=100)
    icon_name: Optional[str] = None

class SkillCreate(SkillBase):
    pass

class SkillUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    level: Optional[int] = Field(None, ge=0, le=100)
    icon_name: Optional[str] = None

class SkillResponse(SkillBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
