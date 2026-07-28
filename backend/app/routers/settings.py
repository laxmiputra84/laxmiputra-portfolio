from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any
from app.database import get_db
from app.schemas.settings import SettingsUpdate, SettingsResponse
from app.services import settings_service
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/settings", tags=["Settings"])

@router.get("/", response_model=SettingsResponse)
def read_settings(db: Session = Depends(get_db)):
    return settings_service.get_settings(db)

@router.put("/", response_model=SettingsResponse)
def update_existing_settings(
    settings_in: SettingsUpdate,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    return settings_service.update_settings(db, settings_in)
