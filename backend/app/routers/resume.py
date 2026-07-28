from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Any
import os
import uuid

from app.database import get_db
from app.schemas.resume import ResumeCreate, ResumeUpdate, ResumeResponse
from app.services import resume_service
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/resume", tags=["Resume"])

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

@router.get("/", response_model=ResumeResponse)
def read_active_resume(db: Session = Depends(get_db)):
    db_resume = resume_service.get_active_resume(db)
    if not db_resume:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active resume found. Please upload one."
        )
    return db_resume

@router.post("/upload", response_model=ResumeResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    title: str = Form("My Resume"),
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    # Validate extension
    _, ext = os.path.splitext(file.filename)
    if ext.lower() != ".pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF files are supported."
        )
        
    # Read file content and check size
    file_bytes = await file.read()
    file_size = len(file_bytes)
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File is too large ({file_size / (1024 * 1024):.2f} MB). Maximum allowed size is 10 MB."
        )
        
    # Ensure folder path exists
    resume_dir = "app/uploads/resume"
    os.makedirs(resume_dir, exist_ok=True)
    
    # Save PDF
    unique_filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(resume_dir, unique_filename)
    try:
        with open(file_path, "wb") as buffer:
            buffer.write(file_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save resume file: {e}"
        )
        
    # Create DB Record (auto-cleans old files)
    resume_in = ResumeCreate(
        title=title,
        file_name=file.filename,
        file_path=file_path,
        file_size=file_size,
        mime_type="application/pdf"
    )
    
    return resume_service.create_resume(db, resume_in)

@router.put("/", response_model=ResumeResponse)
def update_existing_resume(
    resume_in: ResumeUpdate,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    db_resume = resume_service.get_active_resume(db)
    if not db_resume:
        raise HTTPException(status_code=404, detail="Active resume not found")
    return resume_service.update_resume(db, db_resume, resume_in)

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_resume(
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    success = resume_service.delete_resume(db)
    if not success:
        raise HTTPException(status_code=404, detail="Active resume not found")
    return None
