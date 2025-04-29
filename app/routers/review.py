from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, case, asc, desc
from app.database import get_db
from app.models.all import Review
from app.schemas.review import ReviewCreate
from datetime import datetime
from typing import List, Optional

router = APIRouter()

@router.get("/reviews/statistics")
def get_review_statistics(db: Session = Depends(get_db)):
    # Query số lượng review cho mỗi mức rating
    star_counts = (
        db.query(
            func.count(case((Review.rating_start == 1, 1))).label('one_star'),
            func.count(case((Review.rating_start == 2, 1))).label('two_star'),
            func.count(case((Review.rating_start == 3, 1))).label('three_star'),
            func.count(case((Review.rating_start == 4, 1))).label('four_star'),
            func.count(case((Review.rating_start == 5, 1))).label('five_star')
        )
        .one()
    )

    # unpack
    one_star, two_star, three_star, four_star, five_star = star_counts

    total_reviews = one_star + two_star + three_star + four_star + five_star

    # Tính Average Rating (AR)
    if total_reviews == 0:
        average_rating = 0
    else:
        average_rating = (
            (1 * one_star + 2 * two_star + 3 * three_star + 4 * four_star + 5 * five_star)
            / total_reviews
        )

    return {
        "average_rating": round(average_rating, 2),
        "total_reviews": total_reviews,
        "review_counts": {
            "one_star": one_star,
            "two_star": two_star,
            "three_star": three_star,
            "four_star": four_star,
            "five_star": five_star,
        }
    }

@router.get("/reviews")
def get_reviews(db: Session = Depends(get_db)):
    reviews = db.query(Review).all()
    return reviews

@router.post("/create-reviews")
async def create_reviews(review_data: ReviewCreate, db: Session = Depends(get_db)):
    new_review = Review(
        book_id=review_data.book_id,
        review_title=review_data.review_title,
        review_details=review_data.review_details,
        review_date=datetime.utcnow().replace(microsecond=0),
        rating_start=review_data.rating_start
    )
    db.add(new_review)
    db.commit()
    db.refresh(new_review)
    return new_review

@router.get("/reviews/pagination")
def get_reviews(
    db: Session = Depends(get_db),
    skip: int = Query(0),
    limit: int = Query(5),
    sort: str = Query("desc", regex="^(asc|desc)$"),
    rating: Optional[int] = Query(None, ge=1, le=5)
):
    query = db.query(Review)

    # Filtering by rating_start (1-5)
    if rating:
        query = query.filter(Review.rating_start == rating)

    # Sorting by review_date
    if sort == "asc":
        query = query.order_by(asc(Review.review_date))
    else:
        query = query.order_by(desc(Review.review_date))

    # Pagination
    total = query.count()
    reviews = query.offset(skip).limit(limit).all()

    return {
        "total": total,
        "reviews": [
            {
                "id": r.id,
                "book_id": r.book_id,
                "review_title": r.review_title,
                "review_details": r.review_details,
                "review_date": r.review_date.strftime("%Y-%m-%d %H:%M:%S"),
                "rating_start": r.rating_start
            }
            for r in reviews
        ]
    }