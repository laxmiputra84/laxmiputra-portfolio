from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.database import get_db
from app.schemas.education import EducationCreate, EducationUpdate, EducationResponse
from app.services import education_service
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/education", tags=["Education"])

@router.get("/", response_model=List[EducationResponse])
def read_educations(db: Session = Depends(get_db)):
    return education_service.get_educations(db)

@router.get("/{education_id}", response_model=EducationResponse)
def read_education(education_id: int, db: Session = Depends(get_db)):
    db_education = education_service.get_education(db, education_id)
    if not db_education:
        raise HTTPException(status_code=404, detail="Education not found")
    return db_education

@router.post("/", response_model=EducationResponse, status_code=status.HTTP_201_CREATED)
def create_new_education(
    education_in: EducationCreate, 
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    return education_service.create_education(db, education_in)

@router.put("/{education_id}", response_model=EducationResponse)
def update_existing_education(
    education_id: int,
    education_in: EducationUpdate,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    db_education = education_service.get_education(db, education_id)
    if not db_education:
        raise HTTPException(status_code=404, detail="Education not found")
    return education_service.update_education(db, db_education, education_in)

@router.delete("/{education_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_education(
    education_id: int,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    success = education_service.delete_education(db, education_id)
    if not success:
        raise HTTPException(status_code=404, detail="Education not found")
    return None
