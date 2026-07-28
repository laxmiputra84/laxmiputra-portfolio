from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from app.database import Base

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    icon_name = Column(String(50), nullable=True)
    price = Column(String(50), nullable=True) # e.g. "$500+" or "Custom"
    created_at = Column(DateTime, default=datetime.utcnow)
