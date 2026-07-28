from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CertificateBase(BaseModel):
    name: str
    issuing_organization: str
    issue_date: str
    expiration_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    image_url: Optional[str] = None

class CertificateCreate(CertificateBase):
    pass

class CertificateUpdate(BaseModel):
    name: Optional[str] = None
    issuing_organization: Optional[str] = None
    issue_date: Optional[str] = None
    expiration_date: Optional[str] = None
    credential_id: Optional[str] = None
    credential_url: Optional[str] = None
    image_url: Optional[str] = None

class CertificateResponse(CertificateBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
