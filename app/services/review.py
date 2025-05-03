from sqlalchemy.orm import Session
from sqlalchemy import func, case, asc, desc
from app.models.all import Review
from app.schemas.review import ReviewCreate
from datetime import datetime, timedelta
from typing import Optional

def get_review_statistics_service(db: Session):
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
    one_star, two_star, three_star, four_star, five_star = star_counts
    total_reviews = one_star + two_star + three_star + four_star + five_star
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

def get_reviews_service(db: Session):
    return db.query(Review).all()

def create_review_service(review_data: ReviewCreate, db: Session):
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

def get_reviews_paginated_service(db: Session, skip: int, limit: int, sort: str, rating: Optional[int]):
    query = db.query(Review)
    if rating:
        query = query.filter(Review.rating_start == rating)
    if sort == "asc":
        query = query.order_by(asc(Review.review_date))
    else:
        query = query.order_by(desc(Review.review_date))
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
                "review_date": (r.review_date + timedelta(hours=7)).strftime("%Y-%m-%d %H:%M:%S"),
                "rating_start": r.rating_start
            }
            for r in reviews
        ]
    }
