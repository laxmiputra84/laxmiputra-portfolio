from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    issuing_organization = Column(String(100), nullable=False)
    issue_date = Column(String(50), nullable=False)
    expiration_date = Column(String(50), nullable=True)
    credential_id = Column(String(100), nullable=True)
    credential_url = Column(String(255), nullable=True)
    image_url = Column(String(255), nullable=True) # Added for credential images
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
