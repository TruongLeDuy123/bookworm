from app.models.all import Book, Discount, Order, OrderItem
from app.schemas.order import OrderCreate
from sqlalchemy.orm import Session
from datetime import date

def create_order_service(order_data: OrderCreate, db: Session):
    unavailable_books = []
    changed_prices = []
    today = date.today()
    for item in order_data.cart:
        book = db.query(Book).filter(Book.id == item.book_id).first()
        if not book:
            unavailable_books.append(item.book_id)
            continue
        discount = db.query(Discount).filter(
            Discount.book_id == book.id,
            Discount.discount_start_date <= today,
            (Discount.discount_end_date == None) | (Discount.discount_end_date >= today),
            Discount.discount_price != None,
            Discount.discount_price >= 0
        ).first()
        if discount:
            current_price = float(discount.discount_price)
        else:
            current_price = float(book.book_price)
        if float(item.price) != current_price:
            changed_prices.append({
                "book_id": item.book_id,
                "old_price": item.price,
                "new_price": current_price,
                "has_discount": discount is not None
            })
    if unavailable_books:
        return {"success": False, "unavailable_books": unavailable_books}
    if changed_prices:
        return {"success": False, "changed_prices": changed_prices}
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
