from app.models.all import Book, Order, OrderItem
from app.schemas.order import OrderCreate
from sqlalchemy.orm import Session
from datetime import date

def create_order_service(order_data: OrderCreate, db: Session):
    unavailable_books = []
    for item in order_data.cart:
        book = db.query(Book).filter(Book.id == item.book_id).first()
        if not book:
            unavailable_books.append(item.book_id)
    if unavailable_books:
        return {"success": False, "unavailable_books": unavailable_books}
    new_order = Order(
        user_id=order_data.user_id,
        order_amount=sum(item.quantity * item.price for item in order_data.cart),
        order_date=date.today()
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    for item in order_data.cart:
        order_item = OrderItem(
            order_id=new_order.id,
            book_id=item.book_id,
            quantity=item.quantity,
            price=item.price
        )
        db.add(order_item)
    db.commit()
    return {"success": True}
