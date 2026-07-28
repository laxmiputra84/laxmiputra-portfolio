from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.database import get_db
from app.schemas.certificate import CertificateCreate, CertificateUpdate, CertificateResponse
from app.services import certificate_service
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/certificates", tags=["Certificates"])

@router.get("/", response_model=List[CertificateResponse])
def read_certificates(db: Session = Depends(get_db)):
    return certificate_service.get_certificates(db)

@router.get("/{certificate_id}", response_model=CertificateResponse)
def read_certificate(certificate_id: int, db: Session = Depends(get_db)):
    db_certificate = certificate_service.get_certificate(db, certificate_id)
    if not db_certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return db_certificate

@router.post("/", response_model=CertificateResponse, status_code=status.HTTP_201_CREATED)
def create_new_certificate(
    certificate_in: CertificateCreate, 
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    return certificate_service.create_certificate(db, certificate_in)

@router.put("/{certificate_id}", response_model=CertificateResponse)
def update_existing_certificate(
    certificate_id: int,
    certificate_in: CertificateUpdate,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    db_certificate = certificate_service.get_certificate(db, certificate_id)
    if not db_certificate:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return certificate_service.update_certificate(db, db_certificate, certificate_in)

@router.delete("/{certificate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_certificate(
    certificate_id: int,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    success = certificate_service.delete_certificate(db, certificate_id)
    if not success:
        raise HTTPException(status_code=404, detail="Certificate not found")
    return None
