from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.database import get_db
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services import project_service
from app.auth.dependencies import get_current_admin

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("/", response_model=List[ProjectResponse])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return project_service.get_projects(db, skip=skip, limit=limit)

@router.get("/featured", response_model=List[ProjectResponse])
def read_featured_projects(db: Session = Depends(get_db)):
    return project_service.get_featured_projects(db)

@router.get("/{project_id}", response_model=ProjectResponse)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = project_service.get_project(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@router.post("/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_new_project(
    project_in: ProjectCreate, 
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    # Check for duplicate slug
    existing = project_service.get_project_by_slug(db, project_in.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project with slug '{project_in.slug}' already exists."
        )
    return project_service.create_project(db, project_in)

@router.put("/{project_id}", response_model=ProjectResponse)
def update_existing_project(
    project_id: int,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    db_project = project_service.get_project(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    # Check for duplicate slug if updating it
    if project_in.slug and project_in.slug != db_project.slug:
        existing = project_service.get_project_by_slug(db, project_in.slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Project with slug '{project_in.slug}' already exists."
            )
            
    return project_service.update_project(db, db_project, project_in)

@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_project(
    project_id: int,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    success = project_service.delete_project(db, project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return None
