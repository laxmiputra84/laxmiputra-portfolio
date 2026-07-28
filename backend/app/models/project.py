from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from datetime import datetime
from app.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    short_description = Column(String(255), nullable=False)
    full_description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)
    github_url = Column(String(255), nullable=True)
    live_url = Column(String(255), nullable=True)
    technologies = Column(String(255), nullable=False) # e.g. "React,Next.js,Tailwind"
    featured = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
