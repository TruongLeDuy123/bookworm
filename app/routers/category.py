from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.category import CategoryBase
from typing import List
from app.services.category import get_all_categories_service

router = APIRouter()

@router.get("/categories", response_model=List[CategoryBase])
def get_all_categories(db: Session = Depends(get_db)):
    return get_all_categories_service(db)
