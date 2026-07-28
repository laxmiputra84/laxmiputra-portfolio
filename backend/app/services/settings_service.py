from sqlalchemy.orm import Session
from app.models.settings import Settings
from app.schemas.settings import SettingsUpdate

def get_settings(db: Session) -> Settings:
    settings = db.query(Settings).first()
    if not settings:
        settings = Settings(
            site_name="Laxmiputra Portfolio",
            hero_title="Designing & Building Scalable Apps",
            hero_subtitle="Senior Full Stack Engineer",
            contact_email="laxmiputrahipparagi3@gmail.com"
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def update_settings(db: Session, settings_in: SettingsUpdate) -> Settings:
    db_settings = get_settings(db)
    update_data = settings_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_settings, field, value)
    db.commit()
    db.refresh(db_settings)
    return db_settings
