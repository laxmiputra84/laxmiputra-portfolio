from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ResumeBase(BaseModel):
    title: str
    file_name: str
    file_path: str
    file_size: int
    mime_type: str

class ResumeCreate(ResumeBase):
    pass

class ResumeUpdate(BaseModel):
    title: Optional[str] = None

class ResumeResponse(ResumeBase):
    id: int
    uploaded_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
