from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.database import get_db
from app.schemas.social_link import SocialLinkCreate, SocialLinkUpdate, SocialLinkResponse
from app.services import social_link_service
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/social-links", tags=["Social Links"])

@router.get("/", response_model=List[SocialLinkResponse])
def read_social_links(db: Session = Depends(get_db)):
    return social_link_service.get_social_links(db)

@router.get("/{link_id}", response_model=SocialLinkResponse)
def read_social_link(link_id: int, db: Session = Depends(get_db)):
    db_link = social_link_service.get_social_link(db, link_id)
    if not db_link:
        raise HTTPException(status_code=404, detail="Social link not found")
    return db_link

@router.post("/", response_model=SocialLinkResponse, status_code=status.HTTP_201_CREATED)
def create_new_social_link(
    link_in: SocialLinkCreate, 
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    return social_link_service.create_social_link(db, link_in)

@router.put("/{link_id}", response_model=SocialLinkResponse)
def update_existing_social_link(
    link_id: int,
    link_in: SocialLinkUpdate,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    db_link = social_link_service.get_social_link(db, link_id)
    if not db_link:
        raise HTTPException(status_code=404, detail="Social link not found")
    return social_link_service.update_social_link(db, db_link, link_in)

@router.delete("/{link_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_social_link(
    link_id: int,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    success = social_link_service.delete_social_link(db, link_id)
    if not success:
        raise HTTPException(status_code=404, detail="Social link not found")
    return None
