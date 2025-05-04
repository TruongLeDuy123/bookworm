from faker import Faker
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import SessionLocal
from app.models.all import Author, Category, User, Book, Discount, Order, OrderItem, Review
import random
from datetime import date, timedelta
from decimal import Decimal

fake = Faker()
db: Session = SessionLocal()

# Seed Author
def seed_authors(n=10):
    for _ in range(n):
        author = Author(
            author_name=fake.name(),
            author_bio=fake.text(max_nb_chars=200)
        )
        db.add(author)
    db.commit()

# Seed Category (danh sách cố định)
def seed_categories():
    category_names = ["Science", "History", "Fantasy", "Romance", "Adventure", "Art", "Technology", "Education"]
    for name in category_names:
        category = Category(
            category_name=name,
            category_desc=fake.text(max_nb_chars=100)
        )
        db.add(category)
    db.commit()

# Seed User
def seed_users(n=10):
    for _ in range(n):
        user = User(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.unique.email(),
            password="hashedpassword",
            admin=fake.boolean()
        )
        db.add(user)
    db.commit()

# Seed Book (với ảnh thật từ Unsplash dựa theo thể loại, và đảm bảo book_cover_photo có độ dài <= 20 ký tự)
def seed_books(n=20):
    authors = db.query(Author).all()
    categories = db.query(Category).all()

    for _ in range(n):
        author = random.choice(authors)
        category = random.choice(categories)

        # 70% có ảnh, 30% để None
        book_cover_photo = None
        if random.random() < 0.7:
            keyword = category.category_name.lower()
            random_num = random.randint(1, 999)
            book_cover_photo = f"https://source.unsplash.com/200x300/?{keyword},{random_num}"

        book = Book(
            author_id=author.id,
            category_id=category.id,
            book_title=fake.sentence(nb_words=4),
            book_summary=fake.paragraph(nb_sentences=3),
            book_price=round(random.uniform(10, 100), 2),
            book_cover_photo=book_cover_photo  # Có thể là None
        )
        db.add(book)
    db.commit()


# Seed Discount
def seed_discounts():
    books = db.query(Book).all()
    for book in random.sample(books, k=min(10, len(books))):
        start_date = date.today()
        discount = Discount(
            book_id=book.id,
            discount_start_date=start_date,
            discount_end_date=start_date + timedelta(days=30),
            discount_price=(book.book_price * Decimal(str(random.uniform(0.5, 0.9)))).quantize(Decimal("0.01"))
        )
        db.add(discount)
    db.commit()

# Seed Order
def seed_orders(n=15):
    users = db.query(User).all()
    for _ in range(n):
        user = random.choice(users)
        order = Order(
            user_id=user.id,
            order_date=fake.date_time_this_year(),
            order_amount=0.0
        )
        db.add(order)
    db.commit()

# Seed OrderItem
def seed_order_items():
    books = db.query(Book).all()
    orders = db.query(Order).all()
    for order in orders:
        num_items = random.randint(1, 5)
        total_amount = 0.0
        for _ in range(num_items):
            book = random.choice(books)
            quantity = random.randint(1, 3)
            price = float(book.book_price)
            total_amount += quantity * price
            item = OrderItem(
                order_id=order.id,
                book_id=book.id,
                quantity=quantity,
                price=price
            )
            db.add(item)
        order.order_amount = round(total_amount, 2)
    db.commit()

# Seed Review
def seed_reviews():
    books = db.query(Book).all()
    for book in books:
        num_reviews = random.randint(1, 3)
        for _ in range(num_reviews):
            review = Review(
                book_id=book.id,
                review_title=fake.sentence(nb_words=6),
                review_details=fake.text(max_nb_chars=150),
                review_date=fake.date_time_this_year(),
                rating_start=str(random.randint(1, 5))
            )
            db.add(review)
    db.commit()

def remove_duplicate_categories():
    categories = db.query(Category).all()
    seen = set()
    for category in categories:
        if category.category_name in seen:
            db.delete(category)
        else:
            seen.add(category.category_name)
    db.commit()

def remove_books_with_null_category():
    books_with_null_category = db.query(Book).filter(Book.category_id == None).all()
    for book in books_with_null_category:
        db.delete(book)
    db.commit()

# --- RUN ALL ---
if __name__ == "__main__":
    # seed_authors()
    # seed_categories()
    # seed_users()
    # seed_books()
    # seed_discounts()
    # seed_orders()
    # seed_order_items()
    # seed_reviews()
    # remove_books_with_null_category()
    # remove_duplicate_categories()
    print("✅ Đã seed toàn bộ dữ liệu giả thành công!")
