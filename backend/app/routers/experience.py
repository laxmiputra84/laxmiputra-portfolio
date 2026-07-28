from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.database import get_db
from app.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceResponse
from app.services import experience_service
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/experience", tags=["Experience"])

@router.get("/", response_model=List[ExperienceResponse])
def read_experiences(db: Session = Depends(get_db)):
    return experience_service.get_experiences(db)

@router.get("/{experience_id}", response_model=ExperienceResponse)
def read_experience(experience_id: int, db: Session = Depends(get_db)):
    db_experience = experience_service.get_experience(db, experience_id)
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    return db_experience

@router.post("/", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED)
def create_new_experience(
    experience_in: ExperienceCreate, 
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    return experience_service.create_experience(db, experience_in)

@router.put("/{experience_id}", response_model=ExperienceResponse)
def update_existing_experience(
    experience_id: int,
    experience_in: ExperienceUpdate,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    db_experience = experience_service.get_experience(db, experience_id)
    if not db_experience:
        raise HTTPException(status_code=404, detail="Experience not found")
    return experience_service.update_experience(db, db_experience, experience_in)

@router.delete("/{experience_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_experience(
    experience_id: int,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    success = experience_service.delete_experience(db, experience_id)
    if not success:
        raise HTTPException(status_code=404, detail="Experience not found")
    return None
