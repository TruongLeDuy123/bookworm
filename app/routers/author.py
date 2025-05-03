from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.author import AuthorBase
from app.services.author import get_all_authors as service_get_all_authors
from typing import List

router = APIRouter()

@router.get("/authors", response_model=List[AuthorBase])
def get_all_authors(db: Session = Depends(get_db)):
    return service_get_all_authors(db)
