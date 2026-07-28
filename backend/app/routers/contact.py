from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.database import get_db
from app.schemas.contact_message import ContactMessageCreate, ContactMessageUpdate, ContactMessageResponse
from app.services import contact_message_service
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/contact", tags=["Contact"])

@router.post("/", response_model=ContactMessageResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_form(message_in: ContactMessageCreate, db: Session = Depends(get_db)):
    return contact_message_service.create_contact_message(db, message_in)

@router.get("/", response_model=List[ContactMessageResponse])
def read_contact_submissions(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    return contact_message_service.get_contact_messages(db, skip=skip, limit=limit)

@router.delete("/{message_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_contact_submission(
    message_id: int,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    success = contact_message_service.delete_contact_message(db, message_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contact submission not found")
    return None
