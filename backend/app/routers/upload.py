from fastapi import APIRouter, Depends, UploadFile, File, HTTPException, status
import os
import shutil
import uuid
from typing import Any
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/upload", tags=["Upload"])

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".pdf", ".doc", ".docx"}

@router.post("/", status_code=status.HTTP_201_CREATED)
def upload_file(
    file: UploadFile = File(...),
    admin: Any = Depends(get_current_admin)
):
    # Verify file extension
    _, ext = os.path.splitext(file.filename)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File extension {ext} not allowed. Supported: {', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # Ensure upload directory exists
    upload_dir = "app/uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Save file with unique name to prevent collisions
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(upload_dir, filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {e}"
        )
        
    return {"file_url": f"/uploads/{filename}"}
