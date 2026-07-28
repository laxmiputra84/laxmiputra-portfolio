from pydantic import BaseModel, Field, model_validator
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    slug: str
    short_description: str
    full_description: Optional[str] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    featured: Optional[bool] = False
    display_order: Optional[int] = 0

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    short_description: Optional[str] = None
    full_description: Optional[str] = None
    image_url: Optional[str] = None
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    technologies: Optional[List[str]] = None
    featured: Optional[bool] = None
    display_order: Optional[int] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    @model_validator(mode="before")
    @classmethod
    def convert_technologies(cls, data: any) -> any:
        # Handle cases where data is SQLAlchemy model
        if hasattr(data, "technologies") and isinstance(data.technologies, str):
            tech_str = data.technologies
            tech_list = [t.strip() for t in tech_str.split(",") if t.strip()] if tech_str else []
            
            # Reconstruct dictionary from SQLAlchemy object
            dct = {}
            for field in cls.model_fields:
                if field == "technologies":
                    dct["technologies"] = tech_list
                elif hasattr(data, field):
                    dct[field] = getattr(data, field)
            return dct
        return data

    class Config:
        from_attributes = True
