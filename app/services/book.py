from sqlalchemy.orm import joinedload
from sqlalchemy import func, select, case, asc, desc, and_, or_, cast, Integer
from datetime import date
from app.models.all import Book, Discount, Review, Category, Author

def get_top_rated_books_service(db):
    today = date.today()
    discount_subq = (
        db.query(
            Discount.book_id,
            func.min(Discount.discount_price).label("discount_price")
        )
        .filter(
            and_(
                Discount.discount_price >= 0,
                Discount.discount_start_date <= today,
                or_(
                    Discount.discount_end_date == None,
                    Discount.discount_end_date >= today
                )
            )
        )
        .group_by(Discount.book_id)
        .subquery()
    )
    rating_subq = (
        db.query(
            Review.book_id,
            (
                (
                    func.sum(case((Review.rating_start == 1, 1), else_=0)) * 1 +
                    func.sum(case((Review.rating_start == 2, 1), else_=0)) * 2 +
                    func.sum(case((Review.rating_start == 3, 1), else_=0)) * 3 +
                    func.sum(case((Review.rating_start == 4, 1), else_=0)) * 4 +
                    func.sum(case((Review.rating_start == 5, 1), else_=0)) * 5
                ) /
                func.nullif(func.count(Review.rating_start), 0)
            ).label("avg_rating")
        )
        .group_by(Review.book_id)
        .subquery()
    )
    query = (
        db.query(
            Book.id,
            Book.book_title,
            Book.book_price,
            discount_subq.c.discount_price,
            Author.author_name,
            Book.book_cover_photo.label("book_img"),
            func.coalesce(rating_subq.c.avg_rating, 0).label("avg_rating")
        )
        .join(Author, Book.author_id == Author.id)
        .outerjoin(discount_subq, Book.id == discount_subq.c.book_id)
        .join(rating_subq, Book.id == rating_subq.c.book_id)
        .order_by(
            desc(rating_subq.c.avg_rating),
            discount_subq.c.discount_price.asc().nullsfirst()
        )
        .limit(8)
    )
    books = query.all()
    result = []
    for book in books:
        final_price = book.discount_price if book.discount_price is not None else book.book_price
        result.append({
            "book_title": book.book_title,
            "book_price": float(book.book_price),
            "final_price": float(final_price),
            "author_name": book.author_name,
            "book_img": book.book_img,
            "avg_rating": round(float(book.avg_rating), 1),
            "book_id": book.id
        })
    return result

def get_top_books_most_reviews_service(db):
    today = date.today()
    discount_subq = (
        db.query(
            Discount.book_id,
            func.min(Discount.discount_price).label("discount_price")
        )
        .filter(
            and_(
                Discount.discount_price >= 0,
                Discount.discount_start_date <= today,
                or_(Discount.discount_end_date == None, Discount.discount_end_date >= today)
            )
        )
        .group_by(Discount.book_id)
        .subquery()
    )
    query = (
        db.query(
            Book.id,
            Book.book_title,
            Book.book_price,
            Book.book_cover_photo.label("book_img"),
            discount_subq.c.discount_price,
            Author.author_name,
            func.count(Review.id).label("total_reviews")
        )
        .outerjoin(discount_subq, Book.id == discount_subq.c.book_id)
        .join(Author, Book.author_id == Author.id)
        .outerjoin(Review, Book.id == Review.book_id)
        .group_by(Book.id, discount_subq.c.discount_price, Author.author_name)
        .order_by(
            desc(func.count(Review.id)),
            discount_subq.c.discount_price.asc().nullsfirst()
        )
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
            discount_price,
            author_name,
            total_reviews
        ) = book
        final_price = discount_price if discount_price is not None else book_price
        result.append({
            "book_id": book_id,
            "book_title": book_title,
            "book_price": float(book_price),
            "discount_price": float(discount_price) if discount_price is not None else None,
            "final_price": float(final_price),
            "author_name": author_name,
            "book_img": book_img,
            "total_reviews": total_reviews,
        })
    return result

def get_top_discount_books_service(db):
    today = date.today()
    query = (
        db.query(
            Book.book_title,
            Book.book_price,
            Book.id,
            Discount.discount_price,
            (Book.book_price - Discount.discount_price).label("discount_amount"),
            Author.author_name,
            Book.book_cover_photo.label("book_img")
        )
        .join(Discount, Book.id == Discount.book_id)
        .join(Author, Book.author_id == Author.id)
        .filter(
            and_(
                Discount.discount_price >= 0,
                Discount.discount_start_date <= today,
                or_(Discount.discount_end_date == None, Discount.discount_end_date >= today)
            )
        )
        .order_by(desc(Book.book_price - Discount.discount_price))
        .limit(10)
    )
    books = query.all()
    result = []
    for book in books:
        book_data = {
            "book_title": book.book_title,
            "book_price": float(book.book_price),
            "final_price": float(book.discount_price),
            "discount_amount": float(book.discount_amount),
            "author_name": book.author_name,
            "book_img": book.book_img,
            "book_id": book.id
        }
        result.append(book_data)
    return result

def get_book_by_id_service(db, book_id: int):
    book = db.query(Book)\
            .options(joinedload(Book.author))\
            .options(joinedload(Book.category))\
            .filter(Book.id == book_id).first()
    return book

def filter_books_by_rating_service(db, min_rating: float):
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

def pagination_service(db, skip: int, limit: int, sort: str, category_id: int, author_id: int, min_rating: float):
    today = date.today()
    discount_subq = (
        db.query(
            Discount.book_id,
            func.min(Discount.discount_price).label("discount_price")
        )
        .filter(
            and_(
                Discount.discount_price >= 0,
                Discount.discount_start_date <= today,
                or_(Discount.discount_end_date == None, Discount.discount_end_date >= today)
            )
        )
        .group_by(Discount.book_id)
        .subquery()
    )
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
                func.nullif(func.count(Review.rating_start), 0)
            ).label("avg_rating")
        )
        .group_by(Review.book_id)
        .subquery()
    )
    final_price_expr = func.coalesce(discount_subq.c.discount_price, Book.book_price)
    discount_amount_expr = Book.book_price - func.coalesce(discount_subq.c.discount_price, Book.book_price)
    query = db.query(
        Book.id,
        Book.book_title,
        Book.book_price,
        Book.book_cover_photo,
        discount_subq.c.discount_price.label("discount_price"),
        Author.author_name,
        func.coalesce(rating_subq.c.avg_rating, 0).label("avg_rating")
    ).join(Author, Book.author_id == Author.id
    ).outerjoin(discount_subq, Book.id == discount_subq.c.book_id
    ).outerjoin(rating_subq, Book.id == rating_subq.c.book_id)
    if category_id is not None:
        query = query.filter(Book.category_id == category_id)
    if author_id is not None:
        query = query.filter(Book.author_id == author_id)
    if min_rating > 0:
        query = query.filter(func.coalesce(rating_subq.c.avg_rating, 0) >= min_rating)
    if sort == "popularity":
        query = (
            query
            .join(Review, Book.id == Review.book_id, isouter=True)
            .add_columns(func.count(Review.id).label("total_reviews"))
            .group_by(Book.id, Book.book_title, Book.book_price, Book.book_cover_photo,
                      discount_subq.c.discount_price, Author.author_name, rating_subq.c.avg_rating)
            .order_by(
                desc(func.count(Review.id)),
                asc(final_price_expr)
            )
        )
    else:
        query = query.group_by(Book.id, Book.book_title, Book.book_price, Book.book_cover_photo,
                               discount_subq.c.discount_price, Author.author_name, rating_subq.c.avg_rating)
        if sort == "price_asc":
            query = query.order_by(asc(final_price_expr))
        elif sort == "price_desc":
            query = query.order_by(desc(final_price_expr))
        elif sort == "on_sale":
            query = query.order_by(
                desc(discount_amount_expr),
                asc(final_price_expr)
            )
    books = query.offset(skip).limit(limit).all()
    result = []
    for book in books:
        if sort == "popularity":
            book_id, title, price, img, discount_price, author, avg_rating, total_reviews = book
        else:
            book_id, title, price, img, discount_price, author, avg_rating = book
            total_reviews = None
        final_price = discount_price if discount_price is not None else price
        result.append({
            "book_id": book_id,
            "book_title": title,
            "book_price": float(price),
            "discount_price": float(discount_price) if discount_price is not None else None,
            "final_price": float(final_price),
            "author_name": author,
            "book_img": img,
            "avg_rating": round(avg_rating, 2),
            **({"total_reviews": total_reviews} if total_reviews is not None else {})
        })
    return result

def count_books_service(db, category_id: int = None, author_id: int = None, min_rating: int = None):
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
    return query.count()

def get_books_service(db):
    return db.query(Book).all()

def check_book_with_discount_service(db, book_id: int):
    today = date.today()
    discount = (
        db.query(Discount)
        .filter(Discount.book_id == book_id)
        .filter((Discount.discount_start_date <= today) & ((Discount.discount_end_date >= today) | (Discount.discount_end_date == None)))
        .filter(and_(Discount.discount_price != None, Discount.discount_price >= 0))
        .first()
    )
    if discount is None:
        return {"has_discount": False}
    return {"has_discount": True, "discount_price": discount.discount_price}

def get_books_by_category_service(db, category_name: str):
    category = db.query(Category).filter(Category.category_name == category_name).first()
    return db.query(Book).filter(Book.category_id == category.id).all() if category else []

def get_books_by_author_service(db, author_name: str):
    author = db.query(Author).filter(Author.author_name == author_name).first()
    return db.query(Book).filter(Book.author_id == author.id).all() if author else []