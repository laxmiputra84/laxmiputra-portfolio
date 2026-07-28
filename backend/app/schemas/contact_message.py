from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class ContactMessageBase(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessageUpdate(BaseModel):
    is_read: Optional[bool] = None

class ContactMessageResponse(ContactMessageBase):
    id: int
    is_read: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
