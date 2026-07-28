from sqlalchemy.orm import Session
from app.models.contact_message import ContactMessage
from app.schemas.contact_message import ContactMessageCreate, ContactMessageUpdate

def get_contact_messages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).offset(skip).limit(limit).all()

def get_contact_message(db: Session, message_id: int):
    return db.query(ContactMessage).filter(ContactMessage.id == message_id).first()

def create_contact_message(db: Session, message_in: ContactMessageCreate):
    db_message = ContactMessage(**message_in.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

def update_contact_message(db: Session, db_message: ContactMessage, message_in: ContactMessageUpdate):
    update_data = message_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_message, field, value)
    db.commit()
    db.refresh(db_message)
    return db_message

def delete_contact_message(db: Session, message_id: int):
    db_message = get_contact_message(db, message_id)
    if db_message:
        db.delete(db_message)
        db.commit()
        return True
    return False
