from sqlalchemy.orm import Session
from app.models.certificate import Certificate
from app.schemas.certificate import CertificateCreate, CertificateUpdate

def get_certificates(db: Session):
    return db.query(Certificate).all()

def get_certificate(db: Session, certificate_id: int):
    return db.query(Certificate).filter(Certificate.id == certificate_id).first()

def create_certificate(db: Session, certificate_in: CertificateCreate):
    db_certificate = Certificate(**certificate_in.model_dump())
    db.add(db_certificate)
    db.commit()
    db.refresh(db_certificate)
    return db_certificate

def update_certificate(db: Session, db_certificate: Certificate, certificate_in: CertificateUpdate):
    update_data = certificate_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_certificate, field, value)
    db.commit()
    db.refresh(db_certificate)
    return db_certificate

def delete_certificate(db: Session, certificate_id: int):
    db_certificate = get_certificate(db, certificate_id)
    if db_certificate:
        db.delete(db_certificate)
        db.commit()
        return True
    return False
