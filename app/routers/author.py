from sqlalchemy.orm import joinedload
from sqlalchemy import func, select, case, asc, desc
from sqlalchemy.sql import func
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all import Book, Discount, Review, Category, Author
from app.schemas.author import AuthorBase
from typing import List
from fastapi import HTTPException, Query

router = APIRouter()

@router.get("/authors", response_model=List[AuthorBase])
def get_all_authors(db: Session = Depends(get_db)):
    authors = db.query(Author).all()
    return authors
