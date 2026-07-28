from sqlalchemy.orm import Session
from app.models.social_link import SocialLink
from app.schemas.social_link import SocialLinkCreate, SocialLinkUpdate

def get_social_links(db: Session):
    return db.query(SocialLink).all()

def get_social_link(db: Session, link_id: int):
    return db.query(SocialLink).filter(SocialLink.id == link_id).first()

def create_social_link(db: Session, link_in: SocialLinkCreate):
    db_link = SocialLink(**link_in.model_dump())
    db.add(db_link)
    db.commit()
    db.refresh(db_link)
    return db_link

def update_social_link(db: Session, db_link: SocialLink, link_in: SocialLinkUpdate):
    update_data = link_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_link, field, value)
    db.commit()
    db.refresh(db_link)
    return db_link

def delete_social_link(db: Session, link_id: int):
    db_link = get_social_link(db, link_id)
    if db_link:
        db.delete(db_link)
        db.commit()
        return True
    return False
