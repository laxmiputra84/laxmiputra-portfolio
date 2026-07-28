from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Any, Optional
import os
import shutil
import uuid
import pdfplumber
import docx
import io
import re

from app.database import get_db
from app.schemas.skill import SkillCreate, SkillUpdate, SkillResponse
from app.services import skill_service
from app.auth.dependencies import get_current_admin
from app.models.skill import Skill

router = APIRouter(prefix="/skills", tags=["Skills"])

# Skill detection dictionary with aliases/keywords
SKILL_DICTIONARY = {
    "Frontend": [
        {"name": "HTML", "keywords": [r"\bhtml\b", r"\bhtml5\b"]},
        {"name": "CSS", "keywords": [r"\bcss\b", r"\bcss3\b"]},
        {"name": "JavaScript", "keywords": [r"\bjavascript\b", r"\bjs\b"]},
        {"name": "TypeScript", "keywords": [r"\btypescript\b", r"\bts\b"]},
        {"name": "React", "keywords": [r"\breact\b", r"\breactjs\b", r"\breact\.js\b"]},
        {"name": "Next.js", "keywords": [r"\bnextjs\b", r"\bnext\.js\b"]},
        {"name": "Tailwind CSS", "keywords": [r"\btailwind\b", r"\btailwindcss\b"]},
        {"name": "Bootstrap", "keywords": [r"\bbootstrap\b"]},
    ],
    "Backend": [
        {"name": "Python", "keywords": [r"\bpython\b"]},
        {"name": "FastAPI", "keywords": [r"\bfastapi\b"]},
        {"name": "Flask", "keywords": [r"\bflask\b"]},
        {"name": "Django", "keywords": [r"\bdjango\b"]},
        {"name": "Node.js", "keywords": [r"\bnode\b", r"\bnode\.js\b", r"\bnodejs\b"]},
        {"name": "Express", "keywords": [r"\bexpress\b", r"\bexpressjs\b"]},
    ],
    "Database": [
        {"name": "MySQL", "keywords": [r"\bmysql\b"]},
        {"name": "PostgreSQL", "keywords": [r"\bpostgresql\b", r"\bpostgres\b"]},
        {"name": "MongoDB", "keywords": [r"\bmongodb\b", r"\bmongo\b"]},
        {"name": "SQLite", "keywords": [r"\bsqlite\b"]},
    ],
    "Programming": [
        {"name": "C", "keywords": [r"\bc\b"]},
        {"name": "C++", "keywords": [r"\bc\+\+", r"\bcpp\b"]},
        {"name": "Java", "keywords": [r"\bjava\b"]},
    ],
    "DevOps": [
        {"name": "Docker", "keywords": [r"\bdocker\b"]},
        {"name": "Git", "keywords": [r"\bgit\b"]},
        {"name": "GitHub", "keywords": [r"\bgithub\b"]},
        {"name": "Linux", "keywords": [r"\blinux\b"]},
        {"name": "CI/CD", "keywords": [r"\bci/cd\b", r"\bci\s+cd\b"]},
    ],
    "Cloud": [
        {"name": "AWS", "keywords": [r"\baws\b", r"amazon\s+web\s+services"]},
        {"name": "Azure", "keywords": [r"\bazure\b", r"microsoft\s+azure"]},
        {"name": "GCP", "keywords": [r"\bgcp\b", r"google\s+cloud"]},
        {"name": "Firebase", "keywords": [r"\bfirebase\b"]},
    ],
    "AI/ML": [
        {"name": "Pandas", "keywords": [r"\bpandas\b"]},
        {"name": "NumPy", "keywords": [r"\bnumpy\b"]},
        {"name": "TensorFlow", "keywords": [r"\btensorflow\b", r"\btf\b"]},
        {"name": "Scikit-learn", "keywords": [r"\bscikit-learn\b", r"\bsklearn\b"]},
        {"name": "OpenCV", "keywords": [r"\bopencv\b"]},
        {"name": "LangChain", "keywords": [r"\blangchain\b"]},
    ],
    "Soft Skills": [
        {"name": "Communication", "keywords": [r"\bcommunication\b", r"\bcommunicative\b"]},
        {"name": "Leadership", "keywords": [r"\bleadership\b", r"\bleader\b"]},
        {"name": "Teamwork", "keywords": [r"\bteamwork\b", r"\bcollaborative\b", r"\bcollaboration\b"]},
        {"name": "Problem Solving", "keywords": [r"problem\s+solving", r"problem-solving"]},
        {"name": "Time Management", "keywords": [r"time\s+management"]},
    ]
}

def parse_pdf(file_bytes: bytes) -> str:
    try:
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            text = "\n".join([page.extract_text() or "" for page in pdf.pages])
        return text
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corrupted or invalid PDF file: {e}"
        )

def parse_docx(file_bytes: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        text = "\n".join([p.text for p in doc.paragraphs])
        return text
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Corrupted or invalid DOCX file: {e}"
        )

def detect_proficiency(text: str, skill_pos: int, skill_len: int) -> int:
    start = max(0, skill_pos - 40)
    end = min(len(text), skill_pos + skill_len + 40)
    snippet = text[start:end].lower()
    
    if "expert" in snippet or "professional" in snippet:
        return 95
    if "advanced" in snippet or "senior" in snippet:
        return 80
    if "intermediate" in snippet or "medium" in snippet:
        return 60
    if "beginner" in snippet or "basic" in snippet or "junior" in snippet:
        return 40
    return 80

@router.get("/", response_model=List[SkillResponse])
def read_skills(db: Session = Depends(get_db)):
    return skill_service.get_skills(db)

@router.get("/{skill_id}", response_model=SkillResponse)
def read_skill(skill_id: int, db: Session = Depends(get_db)):
    db_skill = skill_service.get_skill(db, skill_id)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@router.post("/", response_model=SkillResponse, status_code=status.HTTP_201_CREATED)
def create_new_skill(
    skill_in: SkillCreate, 
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    return skill_service.create_skill(db, skill_in)

@router.put("/{skill_id}", response_model=SkillResponse)
def update_existing_skill(
    skill_id: int,
    skill_in: SkillUpdate,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    db_skill = skill_service.get_skill(db, skill_id)
    if not db_skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill_service.update_skill(db, db_skill, skill_in)

@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_existing_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    success = skill_service.delete_skill(db, skill_id)
    if not success:
        raise HTTPException(status_code=404, detail="Skill not found")
    return None

# AI-powered Resume Skill Import
@router.post("/import-resume", status_code=status.HTTP_200_OK)
async def import_resume_skills(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    # Verify extension
    _, ext = os.path.splitext(file.filename)
    if ext.lower() not in {".pdf", ".docx"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{ext}'. Supports PDF and DOCX only."
        )
    
    file_bytes = await file.read()
    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The uploaded resume file is empty."
        )
        
    # Ensure resumes upload folder exists
    resumes_dir = "app/uploads/resumes"
    os.makedirs(resumes_dir, exist_ok=True)
    
    # Save the file
    unique_filename = f"{uuid.uuid4()}{ext}"
    saved_path = os.path.join(resumes_dir, unique_filename)
    try:
        with open(saved_path, "wb") as buffer:
            buffer.write(file_bytes)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save resume: {e}"
        )
        
    # Extract Text
    if ext.lower() == ".pdf":
        text = parse_pdf(file_bytes)
    else:
        text = parse_docx(file_bytes)
        
    # Scan text for skills
    detected_skills = []
    text_lower = text.lower()
    
    # Track existing skills from DB
    existing_skills_db = {s.name.lower(): s for s in skill_service.get_skills(db)}
    
    for category, skills in SKILL_DICTIONARY.items():
        for skill_info in skills:
            name = skill_info["name"]
            # Look for matches using regex keywords
            matched = False
            proficiency = 80
            for kw in skill_info["keywords"]:
                match = re.search(kw, text_lower)
                if match:
                    matched = True
                    # Try to detect proficiency in the snippet
                    proficiency = detect_proficiency(text, match.start(), len(match.group()))
                    break
            
            if matched:
                detected_skills.append({
                    "name": name,
                    "category": category,
                    "level": proficiency
                })
                
    # Sort detected list into new vs existing
    new_skills = []
    existing_skills = []
    
    for s in detected_skills:
        name_lower = s["name"].lower()
        if name_lower in existing_skills_db:
            db_skill = existing_skills_db[name_lower]
            existing_skills.append({
                "name": db_skill.name,
                "category": db_skill.category,
                "level": db_skill.level
            })
        else:
            new_skills.append(s)
            
    return {
        "new_skills": new_skills,
        "existing_skills": existing_skills,
        "total_detected": len(detected_skills),
        "saved": 0
    }

@router.post("/import-resume/save", status_code=status.HTTP_201_CREATED)
def save_imported_skills(
    skills_in: List[SkillCreate],
    db: Session = Depends(get_db),
    admin: Any = Depends(get_current_admin)
):
    saved_count = 0
    for s in skills_in:
        # Check duplicate again in database
        existing = db.query(Skill).filter(Skill.name == s.name).first()
        if not existing:
            skill_service.create_skill(db, s)
            saved_count += 1
            
    return {"saved": saved_count}
