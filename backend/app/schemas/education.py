from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class EducationBase(BaseModel):
    institution: str
    degree: str
    field_of_study: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None

class EducationCreate(EducationBase):
    pass

class EducationUpdate(BaseModel):
    institution: Optional[str] = None
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: Optional[str] = None

class EducationResponse(EducationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
