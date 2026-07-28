from sqlalchemy.orm import Session
from app.models.skill import Skill
from app.schemas.skill import SkillCreate, SkillUpdate

def get_skills(db: Session):
    return db.query(Skill).all()

def get_skill(db: Session, skill_id: int):
    return db.query(Skill).filter(Skill.id == skill_id).first()

def create_skill(db: Session, skill_in: SkillCreate):
    db_skill = Skill(**skill_in.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def update_skill(db: Session, db_skill: Skill, skill_in: SkillUpdate):
    update_data = skill_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_skill, field, value)
    db.commit()
    db.refresh(db_skill)
    return db_skill

def delete_skill(db: Session, skill_id: int):
    db_skill = get_skill(db, skill_id)
    if db_skill:
        db.delete(db_skill)
        db.commit()
        return True
    return False
