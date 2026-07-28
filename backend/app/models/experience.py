from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime
from app.database import Base

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(100), nullable=False)
    role = Column(String(100), nullable=False)
    location = Column(String(100), nullable=True)
    start_date = Column(String(50), nullable=False)
    end_date = Column(String(50), nullable=True) # e.g. "Present" or "Dec 2023"
    description = Column(Text, nullable=False)
    current = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
