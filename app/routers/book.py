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

router = APIRouter()

@router.get("/books/top-rated-recommended")
def get_top_rated_books(db: Session = Depends(get_db)):
    today = date.today()

    # Subquery tính tổng discount hợp lệ cho từng book
    discount_subq = (
        db.query(
            Discount.book_id,
            func.sum(Discount.discount_price).label("total_discount")
        )
        .filter(
            and_(
                Discount.discount_price > 0,
                Discount.discount_start_date <= today,
                or_(Discount.discount_end_date == None, Discount.discount_end_date >= today)
            )
        )
        .group_by(Discount.book_id)
        .subquery()
    )

    # Subquery tính điểm trung bình đánh giá cho từng book
    rating_subq = (
        db.query(
            Review.book_id,
            func.avg(func.cast(Review.rating_start, Integer)).label("avg_rating")
        )
        .group_by(Review.book_id)
        .subquery()
    )

    # Query chính
    query = (
        db.query(
            Book.book_title,
            Book.book_price,
            func.coalesce(discount_subq.c.total_discount, 0).label("total_discount"),
            (Book.book_price - func.coalesce(discount_subq.c.total_discount, 0)).label("final_price"),
            Author.author_name,
            Book.book_cover_photo.label("book_img"),
            func.coalesce(rating_subq.c.avg_rating, 0).label("avg_rating")
        )
        .join(Author, Book.author_id == Author.id)
        .outerjoin(discount_subq, Book.id == discount_subq.c.book_id)
        .outerjoin(rating_subq, Book.id == rating_subq.c.book_id)
        .order_by(desc(rating_subq.c.avg_rating), asc(Book.book_price - func.coalesce(discount_subq.c.total_discount, 0)))
        .limit(8)
    )

    books = query.all()

    # Kết quả
    result = []
    for book in books:
        result.append({
            "book_title": book.book_title,
            "book_price": float(book.book_price),
            "total_discount": float(book.total_discount),
            "final_price": float(book.final_price),
            "author_name": book.author_name,
            "book_img": book.book_img,
            "avg_rating": round(float(book.avg_rating), 1)
        })

    return result

@router.get("/books/top-reviewed-poplular")
def get_top_books_most_reviews(db: Session = Depends(get_db)):
    today = date.today()
    # Subquery: tổng discount cho mỗi book
    discount_subq = (
        db.query(
            Discount.book_id,
            func.sum(Discount.discount_price).label("total_discount")
        )
        .filter(
            and_(
                Discount.discount_price > 0,
                Discount.discount_start_date <= today,
                or_(Discount.discount_end_date == None, Discount.discount_end_date >= today)
            )
        )
        .group_by(Discount.book_id)
        .subquery()
    )

    # Query: join review để đếm số lượng đánh giá
    query = (
        db.query(
            Book.id,
            Book.book_title,
            Book.book_price,
            Book.book_cover_photo,
            func.coalesce(discount_subq.c.total_discount, 0).label("total_discount"),
            Author.author_name,
            func.count(Review.id).label("total_reviews")
        )
        .outerjoin(discount_subq, Book.id == discount_subq.c.book_id)
        .join(Author, Book.author_id == Author.id)
        .outerjoin(Review, Book.id == Review.book_id)
        .group_by(Book.id, discount_subq.c.total_discount, Author.author_name)
        .order_by(desc(func.count(Review.id)), asc(Book.book_price - func.coalesce(discount_subq.c.total_discount, 0)))
        .limit(8)
    )

    books = query.all()

    result = []
    for book in books:
        (
            book_id,
            book_title,
            book_price,
            book_img,
            total_discount,
            author_name,
            total_reviews
        ) = book

        final_price = max(book_price - total_discount, 0)

        result.append({
            "id": book_id,
            "book_title": book_title,
            "book_price": book_price,
            "total_discount": total_discount,
            "final_price": final_price,
            "author_name": author_name,
            "book_img": book_img,
            "total_reviews": total_reviews
        })

    return result


# @router.get("/top-books-with-most-discount", response_model=List[dict])
# def get_top_books_with_most_discount(db: Session = Depends(get_db)):
#     # Subquery: tính tổng giảm giá cho từng sách
#     discount_subq = (
#         db.query(
#             Discount.book_id,
#             func.sum(Discount.discount_price).label("total_discount")
#         )
#         .group_by(Discount.book_id)
#         .subquery()
#     )

#     # Truy vấn sách + tổng giảm giá
#     books = (
#         db.query(
#             Book.id,
#             Book.book_title,
#             Book.book_price,
#             func.coalesce(discount_subq.c.total_discount, 0).label("total_discount"),
#             (Book.book_price - func.coalesce(discount_subq.c.total_discount, 0)).label("final_price")
#         )
#         .join(discount_subq, Book.id == discount_subq.c.book_id)
#         .order_by(desc(discount_subq.c.total_discount))  # sắp xếp theo tổng giảm giá giảm dần
#         .limit(10)
#         .all()
#     )

#     # Trả về dữ liệu
#     result = []
#     for book in books:
#         result.append({
#             "id": book.id,
#             "book_title": book.book_title,
#             "book_price": book.book_price,
#             "total_discount": book.total_discount,
#             "final_price": book.final_price,

#         })

#     return result

@router.get("/books/top-discount")
def get_top_discount_books(db: Session = Depends(get_db)):
    today = date.today()
    # Tạo subquery tính tổng discount cho mỗi sách
    discount_subq = (
        db.query(
            Discount.book_id,
            func.sum(Discount.discount_price).label("total_discount")
        )
        .filter(
            and_(
                Discount.discount_price > 0,
                Discount.discount_start_date <= today,
                or_(Discount.discount_end_date == None, Discount.discount_end_date >= today)
            )
        )
        .group_by(Discount.book_id)
        .subquery()
    )

    # Join với bảng Book và Author để lấy thông tin sách và tác giả
    query = (
        db.query(
            Book.book_title,
            Book.book_price,
            Book.id,
            func.coalesce(discount_subq.c.total_discount, 0).label("total_discount"),
            (Book.book_price - func.coalesce(discount_subq.c.total_discount, 0)).label("final_price"),
            Author.author_name,
            Book.book_cover_photo.label("book_img")
        )
        .join(discount_subq, Book.id == discount_subq.c.book_id)
        .join(Author, Book.author_id == Author.id)
        .order_by(desc(discount_subq.c.total_discount))
        .limit(10)
    )

    books = query.all()

    # Chuẩn hóa kết quả
    result = []
    for book in books:
        book_data = {
            "book_title": book.book_title,
            "book_price": float(book.book_price),
            "total_discount": float(book.total_discount),
            "final_price": float(book.final_price),
            "author_name": book.author_name,
            "book_img": book.book_img,
            "book_id": book.id 
        }
        result.append(book_data)

    return result

@router.get("/book/{book_id}")
async def get_book_by_id(db: Session = Depends(get_db), book_id: int = None):
    if book_id is None:
        raise HTTPException(status_code=400, detail="Book ID must be provided")
    book = db.query(Book)\
            .options(joinedload(Book.author))\
            .options(joinedload(Book.category))\
            .filter(Book.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

# @router.get("/books/pagination", response_model=List[BookSchema])
# def pagination(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1), category_id: Optional[int] = Query(None),
#     author_id: Optional[int] = Query(None), sort: Optional[str] = Query("0"), db: Session = Depends(get_db)):
#     query = db.query(Book)
#     if category_id is not None:
#         query = query.filter(Book.category_id == category_id)
#     if author_id is not None:
#         query = query.filter(Book.author_id == author_id)
#     items = query.offset(skip).limit(limit).all()
#     return items

@router.get("/books/filter-by-rating", response_model=List[BookSchema])
def filter_books_by_rating(min_rating: float = Query(0, ge=0, le=5), db: Session = Depends(get_db)):
    # Đếm số lượt đánh giá theo từng sao
    subquery = (
        db.query(
            Review.book_id.label("book_id"),
            func.sum(case((cast(Review.rating_start, Integer) == 1, 1), else_=0)).label("count_1"),
            func.sum(case((cast(Review.rating_start, Integer) == 2, 1), else_=0)).label("count_2"),
            func.sum(case((cast(Review.rating_start, Integer) == 3, 1), else_=0)).label("count_3"),
            func.sum(case((cast(Review.rating_start, Integer) == 4, 1), else_=0)).label("count_4"),
            func.sum(case((cast(Review.rating_start, Integer) == 5, 1), else_=0)).label("count_5")
        )
        .group_by(Review.book_id)
        .subquery()
    )

    # Tính điểm trung bình và join với Book
    query = (
        db.query(Book)
        .join(subquery, Book.id == subquery.c.book_id)
        .filter(
            (
                (1 * subquery.c.count_1 +
                 2 * subquery.c.count_2 +
                 3 * subquery.c.count_3 +
                 4 * subquery.c.count_4 +
                 5 * subquery.c.count_5)
                /
                func.nullif(
                    (subquery.c.count_1 +
                     subquery.c.count_2 +
                     subquery.c.count_3 +
                     subquery.c.count_4 +
                     subquery.c.count_5), 0
                )
            ) >= min_rating
        )
    )

    return query.all()

@router.get("/books/pagination", response_model=List[dict])
def pagination(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1),
    sort: str = Query("none", regex="^(none|price_asc|price_desc|popularity)$"),
    category_id: Optional[int] = Query(None),
    author_id: Optional[int] = Query(None),
    min_rating: float = Query(0, ge=0, le=5),
    db: Session = Depends(get_db)
):
    today = date.today()

    # Subquery tính tổng discount
    discount_subq = (
        db.query(
            Discount.book_id,
            func.sum(Discount.discount_price).label("total_discount")
        )
        .filter(
            and_(
                Discount.discount_price > 0,
                Discount.discount_start_date <= today,
                or_(Discount.discount_end_date == None, Discount.discount_end_date >= today)
            )
        )
        .group_by(Discount.book_id)
        .subquery()
    )

    # Subquery tính rating trung bình từ các review
    rating_subq = (
        db.query(
            Review.book_id,
            (
                (1 * func.sum(case((cast(Review.rating_start, Integer) == 1, 1), else_=0)) +
                 2 * func.sum(case((cast(Review.rating_start, Integer) == 2, 1), else_=0)) +
                 3 * func.sum(case((cast(Review.rating_start, Integer) == 3, 1), else_=0)) +
                 4 * func.sum(case((cast(Review.rating_start, Integer) == 4, 1), else_=0)) +
                 5 * func.sum(case((cast(Review.rating_start, Integer) == 5, 1), else_=0)))
                /
                func.nullif((
                    func.sum(case((Review.rating_start != None, 1), else_=0))
                ), 0)
            ).label("avg_rating")
        )
        .group_by(Review.book_id)
        .subquery()
    )

    # Query chính
    query = db.query(
        Book.id,
        Book.book_title,
        Book.book_price,
        Book.book_cover_photo,
        func.coalesce(discount_subq.c.total_discount, 0).label("total_discount"),
        Author.author_name,
        func.coalesce(rating_subq.c.avg_rating, 0).label("avg_rating")
    ).join(Author, Book.author_id == Author.id
    ).outerjoin(discount_subq, Book.id == discount_subq.c.book_id
    ).outerjoin(rating_subq, Book.id == rating_subq.c.book_id)

    # Filter theo category, author, rating
    if category_id is not None:
        query = query.filter(Book.category_id == category_id)
    if author_id is not None:
        query = query.filter(Book.author_id == author_id)
    if min_rating > 0:
        query = query.filter(func.coalesce(rating_subq.c.avg_rating, 0) >= min_rating)

    # Sắp xếp
    final_price_expr = Book.book_price - func.coalesce(discount_subq.c.total_discount, 0)

    if sort == "popularity":
        query = (
            query
            .join(Review, Book.id == Review.book_id, isouter=True)
            .add_columns(func.count(Review.id).label("total_reviews"))
            .group_by(Book.id, Book.book_title, Book.book_price, Book.book_cover_photo,
                      discount_subq.c.total_discount, Author.author_name, rating_subq.c.avg_rating)
            .order_by(desc(func.count(Review.id)), asc(final_price_expr))
        )
    else:
        query = query.group_by(Book.id, Book.book_title, Book.book_price, Book.book_cover_photo,
                               discount_subq.c.total_discount, Author.author_name, rating_subq.c.avg_rating)

        if sort == "price_asc":
            query = query.order_by(asc(final_price_expr))
        elif sort == "price_desc":
            query = query.order_by(desc(final_price_expr))

    # Pagination
    books = query.offset(skip).limit(limit).all()

    # Kết quả
    result = []
    for book in books:
        if sort == "popularity":
            book_id, title, price, img, discount, author, avg_rating, total_reviews = book
        else:
            book_id, title, price, img, discount, author, avg_rating = book
            total_reviews = None

        result.append({
            "id": book_id,
            "book_title": title,
            "book_price": price,
            "total_discount": discount,
            "final_price": max(price - discount, 0),
            "author_name": author,
            "book_img": img,
            "avg_rating": round(avg_rating, 2),
            **({"total_reviews": total_reviews} if total_reviews is not None else {})
        })

    return result



@router.get("/books/count")
def count_books(category_id: Optional[int] = Query(None), author_id: Optional[int] = Query(None), 
                min_rating: Optional[int] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Book)
    if category_id is not None:
        query = query.filter(Book.category_id == category_id)
    if author_id is not None:
        query = query.filter(Book.author_id == author_id)
    if min_rating is not None:
        subquery = (
            db.query(
                Review.book_id.label("book_id"),
                func.sum(case((cast(Review.rating_start, Integer) == 1, 1), else_=0)).label("count_1"),
                func.sum(case((cast(Review.rating_start, Integer) == 2, 1), else_=0)).label("count_2"),
                func.sum(case((cast(Review.rating_start, Integer) == 3, 1), else_=0)).label("count_3"),
                func.sum(case((cast(Review.rating_start, Integer) == 4, 1), else_=0)).label("count_4"),
                func.sum(case((cast(Review.rating_start, Integer) == 5, 1), else_=0)).label("count_5")
            )
            .group_by(Review.book_id)
            .subquery()
        )

        # Tính điểm trung bình
        total_score = (
            1 * subquery.c.count_1 +
            2 * subquery.c.count_2 +
            3 * subquery.c.count_3 +
            4 * subquery.c.count_4 +
            5 * subquery.c.count_5
        )
        total_reviews = (
            subquery.c.count_1 +
            subquery.c.count_2 +
            subquery.c.count_3 +
            subquery.c.count_4 +
            subquery.c.count_5
        )

        avg_rating = total_score / func.nullif(total_reviews, 0)

        query = query.join(subquery, Book.id == subquery.c.book_id)
        query = query.filter(avg_rating >= min_rating)
    return {"count": query.count()}

@router.get("/books", response_model=List[BookBase])
def get_books(db: Session = Depends(get_db)):
    books = db.query(Book).all()
    return books

@router.get("/book-has-discount/{book_id}")
def check_book_with_discount(db: Session = Depends(get_db), book_id: int = None):
    today = date.today()
    discount = (
        db.query(Discount.book_id, func.sum(Discount.discount_price).label("total_discount"))
        .filter(Discount.book_id == book_id)
        .filter(((Discount.discount_start_date <= today) & (Discount.discount_end_date >= today)) | (Discount.discount_end_date == None))
        .filter(Discount.discount_price > 0)
        .group_by(Discount.book_id)
        .first()
    )
    if discount is None or discount.total_discount == 0:
        return {
            "has_discount": False
        }
    return {
        "has_discount": True,
        "total_discount": discount.total_discount
    }

# @router.get("/sort-books-by-price/", response_model=List[dict])
# def sort_books_by_price(sort: str = Query('asc', regex='^(asc|desc)$'), db: Session = Depends(get_db)):
#     if sort == 'asc':
#         books = db.query(Book).join(Discount, Book.id == Discount.book_id).group_by(Book.id).order_by(asc(Book.book_price - func.sum(Discount.discount_price))).all()
#     else:
#         books = db.query(Book).join(Discount, Book.id == Discount.book_id).group_by(Book.id).order_by(desc(Book.book_price - func.sum(Discount.discount_price))).all()

#     result = []
#     for book in books:
#         total_discount = db.query(func.sum(Discount.discount_price)).filter(Discount.book_id == book.id).scalar() or 0
#         final_price = book.book_price - total_discount

#         result.append({
#             "id": book.id,
#             "title": book.book_title,
#             "book_price": book.book_price,
#             "total_discount": total_discount,
#             "final_price": final_price
#         })

#     return result

# @router.get("/sort-books-by-popularity/", response_model=List[dict])
# def sort_books_by_popularity(db: Session = Depends(get_db)):
#     # Subquery tính tổng giảm giá cho từng book
#     discount_subq = (
#         db.query(
#             Discount.book_id,
#             func.sum(Discount.discount_price).label("total_discount")
#         )
#         .group_by(Discount.book_id)
#         .subquery()  # Chuyển đổi thành subquery
#     )

#     # Truy vấn sách, tính tổng số lượng review và final_price (book_price - total_discount)
#     books = db.query(
#         Book.id, 
#         Book.book_title, 
#         Book.book_price,
#         # Lấy tổng giảm giá từ subquery
#         func.coalesce(discount_subq.c.total_discount, 0).label('total_discount'),
#         func.count(Review.id).label('total_reviews')
#     ) \
#     .join(discount_subq, Book.id == discount_subq.c.book_id, isouter=True) \
#     .join(Review, Book.id == Review.book_id, isouter=True) \
#     .group_by(Book.id, discount_subq.c.total_discount) \
#     .order_by(
#         desc(func.count(Review.id)),  # Sắp xếp theo số lượng review giảm dần
#         asc(Book.book_price - func.coalesce(discount_subq.c.total_discount, 0))  # Sắp xếp theo final_price tăng dần
#     ) \
#     .all()

#     # Xây dựng kết quả trả về
#     result = []
#     for book in books:
#         total_discount = book.total_discount
#         final_price = book.book_price - total_discount

#         # Đảm bảo giá cuối cùng không âm
#         final_price = max(final_price, 0)

#         total_reviews = book.total_reviews or 0
        
#         result.append({
#             "id": book.id,
#             "book_title": book.book_title,
#             "book_price": book.book_price,
#             "total_discount": total_discount,
#             "final_price": final_price,
#             "total_reviews": total_reviews
#         })
    
#     return result

@router.get("/books-by-category/{category_name}", response_model=List[BookSchema])
def get_books_by_category(category_name: str, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.category_name == category_name).first()
    return db.query(Book).filter(Book.category_id == category.id).all()

@router.get("/books-by-author/{author_name}", response_model=List[BookSchema])
def get_books_by_author(author_name: str, db: Session = Depends(get_db)):
    author = db.query(Author).filter(Author.author_name == author_name).first()
    return db.query(Book).filter(Book.author_id == author.id).all()

@router.get("/books/top-reviewed")
def get_top_reviewed_books(db: Session = Depends(get_db)):
    today = date.today()
    # Subquery để lấy giá sau giảm (final_price)
    subq_discount = (
        db.query(
            Discount.book_id,
            (Book.book_price - Discount.discount_price).label("final_price")
        )
        .filter(
            and_(
                Discount.discount_price > 0,
                Discount.discount_start_date <= today,
                or_(Discount.discount_end_date == None, Discount.discount_end_date >= today)
            )
        )
        .join(Book, Book.id == Discount.book_id)
        .subquery()
    )

    # Truy vấn chính
    results = (
        db.query(
            Book.id,
            Book.book_title,
            func.count(Review.id).label("review_count"),
            func.coalesce(subq_discount.c.final_price, Book.book_price).label("final_price")
        )
        .outerjoin(Review, Book.id == Review.book_id)
        .outerjoin(subq_discount, Book.id == subq_discount.c.book_id)
        .group_by(Book.id, subq_discount.c.final_price)
        .order_by(func.count(Review.id).desc())
        .limit(8)
        .all()
    )

    # Chuyển dữ liệu thành dạng list of dicts
    return [
        {
            "book_id": r.id,
            "title": r.book_title,
            "review_count": r.review_count,
            "final_price": float(r.final_price)
        }
        for r in results
    ]