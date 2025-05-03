from sqlalchemy.orm import joinedload
from sqlalchemy import func, select, case, asc, desc, and_, or_
from sqlalchemy import func, cast, Integer
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all import Book, Discount, Review, Category, Author
from app.schemas.book import BookSchema, BookBase, DiscountSchema, BookDiscountSchema
from typing import List, Optional
from fastapi import HTTPException, Query
from datetime import date
from app.services.book import (
    get_top_rated_books_service,
    get_top_books_most_reviews_service,
    get_top_discount_books_service,
    get_book_by_id_service,
    filter_books_by_rating_service,
    pagination_service,
    count_books_service,
    get_books_service,
    check_book_with_discount_service,
    get_books_by_category_service,
    get_books_by_author_service
)

router = APIRouter()

@router.get("/books/top-rated-recommended")
def get_top_rated_books(db: Session = Depends(get_db)):
    return get_top_rated_books_service(db)

@router.get("/books/top-reviewed-popular")
def get_top_books_most_reviews(db: Session = Depends(get_db)):
    return get_top_books_most_reviews_service(db)

@router.get("/books/top-discount")
def get_top_discount_books(db: Session = Depends(get_db)):
    return get_top_discount_books_service(db)

@router.get("/book/{book_id}")
async def get_book_by_id(db: Session = Depends(get_db), book_id: int = None):
    if book_id is None:
        raise HTTPException(status_code=400, detail="Book ID must be provided")
    book = get_book_by_id_service(db, book_id)
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@router.get("/books/filter-by-rating", response_model=List[BookSchema])
def filter_books_by_rating(min_rating: float = Query(0, ge=0, le=5), db: Session = Depends(get_db)):
    return filter_books_by_rating_service(db, min_rating)

@router.get("/books/pagination", response_model=List[dict])
def pagination(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    sort: str = Query("on_sale", pattern="^(on_sale|popularity|price_asc|price_desc)$"),
    category_id: Optional[int] = Query(None),
    author_id: Optional[int] = Query(None),
    min_rating: float = Query(0, ge=0, le=5),
    db: Session = Depends(get_db)
):
    return pagination_service(db, skip, limit, sort, category_id, author_id, min_rating)

@router.get("/books/count")
def count_books(category_id: Optional[int] = Query(None), author_id: Optional[int] = Query(None), 
                min_rating: Optional[int] = Query(None), db: Session = Depends(get_db)):
    return {"count": count_books_service(db, category_id, author_id, min_rating)}

@router.get("/books", response_model=List[BookBase])
def get_books(db: Session = Depends(get_db)):
    return get_books_service(db)

@router.get("/book-has-discount/{book_id}")
def check_book_with_discount(db: Session = Depends(get_db), book_id: int = None):
    return check_book_with_discount_service(db, book_id)

@router.get("/books-by-category/{category_name}", response_model=List[BookSchema])
def get_books_by_category(category_name: str, db: Session = Depends(get_db)):
    return get_books_by_category_service(db, category_name)

@router.get("/books-by-author/{author_name}", response_model=List[BookSchema])
def get_books_by_author(author_name: str, db: Session = Depends(get_db)):
    return get_books_by_author_service(db, author_name)
