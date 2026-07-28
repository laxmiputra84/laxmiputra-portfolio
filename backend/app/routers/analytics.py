from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/")
def get_analytics():
    return {"views": 100, "clicks": 50}
