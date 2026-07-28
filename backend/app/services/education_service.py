from sqlalchemy.orm import Session
from app.models.education import Education
from app.schemas.education import EducationCreate, EducationUpdate

def get_educations(db: Session):
    return db.query(Education).all()

def get_education(db: Session, education_id: int):
    return db.query(Education).filter(Education.id == education_id).first()

def create_education(db: Session, education_in: EducationCreate):
    db_education = Education(**education_in.model_dump())
    db.add(db_education)
    db.commit()
    db.refresh(db_education)
    return db_education

def update_education(db: Session, db_education: Education, education_in: EducationUpdate):
    update_data = education_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_education, field, value)
    db.commit()
    db.refresh(db_education)
    return db_education

def delete_education(db: Session, education_id: int):
    db_education = get_education(db, education_id)
    if db_education:
        db.delete(db_education)
        db.commit()
        return True
    return False
