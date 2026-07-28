from sqlalchemy.orm import Session
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate

def get_services(db: Session):
    return db.query(Service).all()

def get_service(db: Session, service_id: int):
    return db.query(Service).filter(Service.id == service_id).first()

def create_service(db: Session, service_in: ServiceCreate):
    db_service = Service(**service_in.model_dump())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

def update_service(db: Session, db_service: Service, service_in: ServiceUpdate):
    update_data = service_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_service, field, value)
    db.commit()
    db.refresh(db_service)
    return db_service

def delete_service(db: Session, service_id: int):
    db_service = get_service(db, service_id)
    if db_service:
        db.delete(db_service)
        db.commit()
        return True
    return False
