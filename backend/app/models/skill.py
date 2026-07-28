from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from app.database import Base

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)
    category = Column(String(50), nullable=False) # Frontend, Backend, Devops, Tools, etc.
    level = Column(Integer, default=100) # 0-100 proficiency
    icon_name = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
