from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.all import Order, OrderItem, Book, Author
from app.schemas.order import OrderBase
from typing import List
import requests

router = APIRouter()

@router.get("/cart/{user_id}")
def get_cart_items(user_id: int, db: Session = Depends(get_db)):
    orders = (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .all()
    )

    if not orders:
        return []
    
    cart_items = []
    for order in orders:
        items = (
            db.query(OrderItem)
            .options(joinedload(OrderItem.book).joinedload(Book.author))
            .filter(OrderItem.order_id == order.id)
            .all()
        )
        for item in items:
            book = item.book
            # Gọi API `book-has-discount/{book_id}` để lấy thông tin giảm giá
            response = requests.get(f"http://127.0.0.1:8001/book-has-discount/{book.id}")
            discount_data = response.json()
            has_discount = discount_data.get('has_discount', False)
            discount_price = discount_data.get('discount_price', 0) if has_discount else 0
            cart_items.append({
                "book_id": book.id,
                "book_title": book.book_title,
                "author_name": book.author.author_name if book.author else "Unknown Author",
                "book_cover_photo": book.book_cover_photo,  
                "price": float(item.price),
                "quantity": item.quantity,
                "total": float(item.price) * item.quantity,
                "has_discount": has_discount,
                "discount_price": discount_price
            })

    return cart_items

    # orders_id = db.query(Order).filter(Order.user_id == user_id).all()
    # arr = []
    # for order_id in orders_id:
    #     order_items = db.query(OrderItem).filter(OrderItem.order_id == order_id.id).all() 
    #     for order_item in order_items:
    #         book = db.query(Book).filter(Book.id == order_item.book_id).first()
    #         author = db.query(Author).filter(Author.id == book.author_id).first()
    #         arr.append({
    #             "book_title": book.book_title,
    #             "book_image" : book.book_cover_photo,
    #             "author_name": author.author_name,
    #             "price": order_item.price,
    #             "quantity": order_item.quantity,
    #             "total_price": order_item.price * order_item.quantity,
    #         })
    # return arr
