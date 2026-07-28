from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class SocialLinkBase(BaseModel):
    platform: str
    url: str
    is_active: Optional[bool] = True

class SocialLinkCreate(SocialLinkBase):
    pass

class SocialLinkUpdate(BaseModel):
    platform: Optional[str] = None
    url: Optional[str] = None
    is_active: Optional[bool] = None

class SocialLinkResponse(SocialLinkBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
