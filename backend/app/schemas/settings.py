from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional
from datetime import datetime

class SettingsBase(BaseModel):
    site_name: str
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    about_text: Optional[str] = None
    profile_image: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def empty_strings_to_none(cls, values: any) -> any:
        if isinstance(values, dict):
            for key, val in values.items():
                if val == "":
                    values[key] = None
        return values

class SettingsCreate(SettingsBase):
    pass

class SettingsUpdate(BaseModel):
    site_name: Optional[str] = None
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    about_text: Optional[str] = None
    profile_image: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def empty_strings_to_none(cls, values: any) -> any:
        if isinstance(values, dict):
            for key, val in values.items():
                if val == "":
                    values[key] = None
        return values

class SettingsResponse(SettingsBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
