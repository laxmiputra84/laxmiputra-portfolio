from sqlalchemy.orm import Session
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Project).order_by(Project.display_order.asc(), Project.id.asc()).offset(skip).limit(limit).all()

def get_featured_projects(db: Session):
    return db.query(Project).filter(Project.featured == True).order_by(Project.display_order.asc()).all()

def get_project(db: Session, project_id: int):
    return db.query(Project).filter(Project.id == project_id).first()

def get_project_by_slug(db: Session, slug: str):
    return db.query(Project).filter(Project.slug == slug).first()

def create_project(db: Session, project_in: ProjectCreate):
    dump_data = project_in.model_dump()
    if isinstance(dump_data.get("technologies"), list):
        dump_data["technologies"] = ",".join(dump_data["technologies"])
    
    db_project = Project(**dump_data)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, db_project: Project, project_in: ProjectUpdate):
    update_data = project_in.model_dump(exclude_unset=True)
    if "technologies" in update_data and isinstance(update_data["technologies"], list):
        update_data["technologies"] = ",".join(update_data["technologies"])
        
    for field, value in update_data.items():
        setattr(db_project, field, value)
    db.commit()
    db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: int):
    db_project = get_project(db, project_id)
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False
