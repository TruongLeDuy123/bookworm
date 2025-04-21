from sqlalchemy.orm import joinedload
from sqlalchemy import func, select, case, asc, desc
from sqlalchemy.sql import func
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all import Book, Discount, Review, Category, Author
from app.schemas.category import CategoryBase
from typing import List
from fastapi import HTTPException, Query

router = APIRouter()

@router.get("/categories", response_model=List[CategoryBase])
def get_all_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.category_name).all()
    return categories
