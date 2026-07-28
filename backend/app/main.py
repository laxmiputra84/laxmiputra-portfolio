from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import os
import logging

from app.config import settings
from app.database import engine, Base
from app.middleware.cors import add_cors_middleware
from app.middleware.exception import ExceptionHandlerMiddleware
from app.middleware.auth import CustomAuthMiddleware
from app.routers import auth, projects, skills, experience, services, contact, resume, analytics, education, certificates, social_links, settings as settings_router, upload

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("portfolio")

# Create tables (fallback if Alembic is not run yet)
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables verified/created successfully.")
except Exception as e:
    logger.error(f"Failed to auto-create database tables: {e}")

# Initialize App
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API service for Full Stack Developer Portfolio",
    version="1.0.0",
    debug=settings.DEBUG
)

# Exception Handling Middleware (MUST be added first to catch everything)
app.add_middleware(ExceptionHandlerMiddleware)

# Custom Auth Middleware
app.add_middleware(CustomAuthMiddleware)

# Add CORS configuration
add_cors_middleware(app)

# Ensure upload/static folders exist
os.makedirs("app/uploads", exist_ok=True)
os.makedirs("app/static", exist_ok=True)

# Mount static and uploads
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/uploads", StaticFiles(directory="app/uploads"), name="uploads")

# Health Check
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME}

# Include routers
api_prefix = "/api/v1"
app.include_router(auth.router, prefix=api_prefix)
app.include_router(projects.router, prefix=api_prefix)
app.include_router(skills.router, prefix=api_prefix)
app.include_router(experience.router, prefix=api_prefix)
app.include_router(services.router, prefix=api_prefix)
app.include_router(contact.router, prefix=api_prefix)
app.include_router(resume.router, prefix=api_prefix)
app.include_router(analytics.router, prefix=api_prefix)
app.include_router(education.router, prefix=api_prefix)
app.include_router(certificates.router, prefix=api_prefix)
app.include_router(social_links.router, prefix=api_prefix)
app.include_router(settings_router.router, prefix=api_prefix)
app.include_router(upload.router, prefix=api_prefix)
