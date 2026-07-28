from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.database import get_db
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.services import service_service
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/services", tags=["Services"])

@router.get("/", response_model=List[ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    return service_service.get_services(db)

@router.get("/{service_id}", response_model=ServiceResponse)
def read_service(service_id: int, db: Session = Depends(get_db)):
    db_service = service_service.get_service(db, service_id)
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    return db_service

@router.post("/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_new_service(
    service_in: ServiceCreate, 
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    return service_service.create_service(db, service_in)

@router.put("/{service_id}", response_model=ServiceResponse)
def update_existing_service(
    service_id: int,
    service_in: ServiceUpdate,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    db_service = service_service.get_service(db, service_id)
    if not db_service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service_service.update_service(db, db_service, service_in)

@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_service(
    service_id: int,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    success = service_service.delete_service(db, service_id)
    if not success:
        raise HTTPException(status_code=404, detail="Service not found")
    return None
