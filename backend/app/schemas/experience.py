from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ExperienceBase(BaseModel):
    company: str
    role: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    description: str
    current: Optional[bool] = False

class ExperienceCreate(ExperienceBase):
    pass

class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None
    current: Optional[bool] = None

class ExperienceResponse(ExperienceBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
