from sqlalchemy.orm import Session
from app.models.experience import Experience
from app.schemas.experience import ExperienceCreate, ExperienceUpdate

def get_experiences(db: Session):
    return db.query(Experience).all()

def get_experience(db: Session, experience_id: int):
    return db.query(Experience).filter(Experience.id == experience_id).first()

def create_experience(db: Session, experience_in: ExperienceCreate):
    db_experience = Experience(**experience_in.model_dump())
    db.add(db_experience)
    db.commit()
    db.refresh(db_experience)
    return db_experience

def update_experience(db: Session, db_experience: Experience, experience_in: ExperienceUpdate):
    update_data = experience_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_experience, field, value)
    db.commit()
    db.refresh(db_experience)
    return db_experience

def delete_experience(db: Session, experience_id: int):
    db_experience = get_experience(db, experience_id)
    if db_experience:
        db.delete(db_experience)
        db.commit()
        return True
    return False
