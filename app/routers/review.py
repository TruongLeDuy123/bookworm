from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.review import ReviewCreate
from typing import Optional
from app.services import review as review_service

router = APIRouter()

@router.get("/reviews/statistics/{book_id}")
def get_review_statistics(book_id: int, db: Session = Depends(get_db)):
    return review_service.get_review_statistics_service(db, book_id)


@router.get("/reviews")
def get_reviews(db: Session = Depends(get_db)):
    return review_service.get_reviews_service(db)

@router.post("/create-reviews")
async def create_reviews(review_data: ReviewCreate, db: Session = Depends(get_db)):
    return review_service.create_review_service(review_data, db)

@router.get("/reviews/pagination")
def get_reviews(
    db: Session = Depends(get_db),
    book_id: int = Query(...),
    skip: int = Query(0),
    limit: int = Query(5),
    sort: str = Query("desc", regex="^(asc|desc)$"),
    rating: Optional[int] = Query(None, ge=1, le=5)
):
    return review_service.get_reviews_paginated_service(db, book_id, skip, limit, sort, rating)
