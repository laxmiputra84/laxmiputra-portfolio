from sqlalchemy.orm import Session
from app.models.resume import Resume
from app.schemas.resume import ResumeCreate, ResumeUpdate
import os

def get_active_resume(db: Session) -> Resume:
    # Get the latest uploaded resume
    return db.query(Resume).order_by(Resume.id.desc()).first()

def create_resume(db: Session, resume_in: ResumeCreate) -> Resume:
    # Delete existing resumes and files from disk first to keep a single active resume
    existing_resumes = db.query(Resume).all()
    for r in existing_resumes:
        if os.path.exists(r.file_path):
            try:
                os.remove(r.file_path)
            except Exception:
                pass
        db.delete(r)
    db.commit()

    db_resume = Resume(**resume_in.model_dump())
    db.add(db_resume)
    db.commit()
    db.refresh(db_resume)
    return db_resume

def update_resume(db: Session, db_resume: Resume, resume_in: ResumeUpdate) -> Resume:
    update_data = resume_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_resume, field, value)
    db.commit()
    db.refresh(db_resume)
    return db_resume

def delete_resume(db: Session) -> bool:
    db_resume = get_active_resume(db)
    if db_resume:
        if os.path.exists(db_resume.file_path):
            try:
                os.remove(db_resume.file_path)
            except Exception:
                pass
        db.delete(db_resume)
        db.commit()
        return True
    return False
