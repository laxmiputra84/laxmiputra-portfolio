import sys
import os
# Add backend to sys.path to run as standalone script
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models.user import User
from app.models.settings import Settings
from app.models.skill import Skill
from app.models.project import Project
from app.models.experience import Experience
from app.models.education import Education
from app.models.certificate import Certificate
from app.models.social_link import SocialLink
from app.auth.security import get_password_hash

def seed_db():
    db: Session = SessionLocal()
    print("Seeding database...")
    
    # 1. Create Admin User
    admin = db.query(User).filter(User.username == "admin").first()
    if not admin:
        admin = User(
            username="admin",
            email="laxmiputrahipparagi3@gmail.com",
            hashed_password=get_password_hash("Admin@Portfolio2024"),
            full_name="Laxmiputra Hipparagi",
            is_active=True,
            is_admin=True
        )
        db.add(admin)
        print("Admin user created.")
    else:
        print("Admin user already exists.")

    # 2. Create Default Settings
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings(
            site_name="Laxmiputra Portfolio",
            hero_title="Designing & Building Scalable Apps",
            hero_subtitle="Senior Full Stack Engineer & Software Architect",
            contact_email="laxmiputrahipparagi3@gmail.com",
            contact_phone="+919876543210",
            about_text="I am a Senior Full Stack Engineer specializing in robust backends (FastAPI, Python) and elegant frontend user experiences (Next.js, Tailwind, TypeScript)."
        )
        db.add(settings)
        print("Default settings created.")
    else:
        print("Default settings already exist.")

    # 3. Create Sample Skills
    skills_data = [
        {"name": "Next.js", "category": "Frontend", "level": 95, "icon_name": "SiNextdotjs"},
        {"name": "TypeScript", "category": "Frontend", "level": 90, "icon_name": "SiTypescript"},
        {"name": "Tailwind CSS", "category": "Frontend", "level": 95, "icon_name": "SiTailwindcss"},
        {"name": "FastAPI", "category": "Backend", "level": 95, "icon_name": "SiFastapi"},
        {"name": "SQLAlchemy", "category": "Backend", "level": 90, "icon_name": "SiSqlalchemy"},
        {"name": "MySQL", "category": "Backend", "level": 85, "icon_name": "SiMysql"},
        {"name": "Docker", "category": "DevOps", "level": 80, "icon_name": "SiDocker"},
    ]
    for s in skills_data:
        existing = db.query(Skill).filter(Skill.name == s["name"]).first()
        if not existing:
            db.add(Skill(**s))
            print(f"Skill '{s['name']}' created.")

    # 4. Create Sample Projects
    projects_data = [
        {
            "title": "E-Commerce Cloud Platform",
            "slug": "ecommerce-cloud",
            "short_description": "A fully redundant microservices e-commerce system built with Next.js, FastAPI, and MySQL.",
            "full_description": "Detailed multi-layered architecture involving message queues, decoupled database clusters, and containerized deployments supporting high concurrency.",
            "image_url": "https://placehold.co/600x400/png",
            "github_url": "https://github.com/laxmiputra84/ecommerce-cloud",
            "live_url": "https://ecommerce.laxmiputra.dev",
            "technologies": "Next.js, FastAPI, MySQL, Docker",
            "featured": True,
            "display_order": 1
        },
        {
            "title": "NovaBite AI Engine",
            "slug": "novabite-ai",
            "short_description": "AI assistant designed for smart recipe recommendations and inventory tracking.",
            "full_description": "Integrates LLM APIs and Vector Search embeddings to provide customized diet plans based on real-time home pantry logs.",
            "image_url": "https://placehold.co/600x400/png",
            "github_url": "https://github.com/laxmiputra84/novabite-ai",
            "live_url": "https://novabite.laxmiputra.dev",
            "technologies": "FastAPI, Python, OpenAI, Tailwind",
            "featured": True,
            "display_order": 2
        }
    ]
    for p in projects_data:
        existing = db.query(Project).filter(Project.title == p["title"]).first()
        if not existing:
            db.add(Project(**p))
            print(f"Project '{p['title']}' created.")

    # 5. Create Sample Experience
    exp_data = [
        {
            "company": "Tech Solutions Inc.",
            "role": "Senior Full Stack Engineer",
            "location": "Remote",
            "start_date": "June 2023",
            "end_date": "Present",
            "description": "Spearheaded FastAPI migration and designed robust responsive Next.js architectures.",
            "current": True
        },
        {
            "company": "Web Labs LLC",
            "role": "Full Stack Developer",
            "location": "Hybrid",
            "start_date": "January 2021",
            "end_date": "May 2023",
            "description": "Implemented SQLAlchemy databases and designed interactive components in React.",
            "current": False
        }
    ]
    for e in exp_data:
        existing = db.query(Experience).filter(Experience.company == e["company"], Experience.role == e["role"]).first()
        if not existing:
            db.add(Experience(**e))
            print(f"Experience at '{e['company']}' created.")

    # 6. Create Sample Education
    edu_data = [
        {
            "institution": "State University",
            "degree": "Bachelor of Science",
            "field_of_study": "Computer Science",
            "start_date": "August 2017",
            "end_date": "May 2021",
            "description": "GPA: 3.8/4.0. Core coursework: Algorithms, Database Management, Web Engineering."
        }
    ]
    for edu in edu_data:
        existing = db.query(Education).filter(Education.institution == edu["institution"], Education.degree == edu["degree"]).first()
        if not existing:
            db.add(Education(**edu))
            print(f"Education at '{edu['institution']}' created.")

    # 7. Create Sample Certificates
    cert_data = [
        {
            "name": "AWS Certified Solutions Architect",
            "issuing_organization": "Amazon Web Services",
            "issue_date": "September 2024",
            "expiration_date": "September 2027",
            "credential_id": "AWS-ASA-1234",
            "credential_url": "https://aws.amazon.com/verification"
        }
    ]
    for c in cert_data:
        existing = db.query(Certificate).filter(Certificate.name == c["name"]).first()
        if not existing:
            db.add(Certificate(**c))
            print(f"Certificate '{c['name']}' created.")

    # 8. Create Sample Social Links
    links_data = [
        {"platform": "GitHub", "url": "https://github.com/laxmiputra84", "is_active": True},
        {"platform": "LinkedIn", "url": "https://linkedin.com/in/laxmiputra", "is_active": True}
    ]
    for link in links_data:
        existing = db.query(SocialLink).filter(SocialLink.platform == link["platform"]).first()
        if not existing:
            db.add(SocialLink(**link))
            print(f"Social Link for '{link['platform']}' created.")

    db.commit()
    db.close()
    print("Database seeding completed successfully.")

if __name__ == "__main__":
    seed_db()
