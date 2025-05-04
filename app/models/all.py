from sqlalchemy import Column, String, Text, Integer, BigInteger, Numeric, ForeignKey, Date, TIMESTAMP, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class Author(Base):
    __tablename__ = 'author'

    id = Column(BigInteger, primary_key=True)
    author_name = Column(String(255))
    author_bio = Column(Text)

    books = relationship("Book", back_populates="author")

class Book(Base):
    __tablename__ = 'book'

    id = Column(BigInteger, primary_key=True)
    category_id = Column(BigInteger, ForeignKey("category.id"))
    author_id = Column(BigInteger, ForeignKey("author.id"))
    book_title = Column(String(255))
    book_summary = Column(Text)
    book_price = Column(Numeric(5, 2))
    book_cover_photo = Column(String(20), nullable=True)

    category = relationship("Category", back_populates="books")
    author = relationship("Author", back_populates="books")
    discounts = relationship("Discount", back_populates="book")
    reviews = relationship("Review", back_populates="book")
    order_items = relationship("OrderItem", back_populates="book")

class Category(Base):
    __tablename__ = 'category'

    id = Column(BigInteger, primary_key=True)
    category_name = Column(String(120))
    category_desc = Column(String(255))

    books = relationship("Book", back_populates="category")

class Discount(Base):
    __tablename__ = 'discount'

    id = Column(BigInteger, primary_key=True)
    book_id = Column(BigInteger, ForeignKey("book.id"))
    discount_start_date = Column(Date)
    discount_end_date = Column(Date, nullable=True)
    discount_price = Column(Numeric(5, 2))

    book = relationship("Book", back_populates="discounts")

class OrderItem(Base):
    __tablename__ = 'order_item'

    id = Column(BigInteger, primary_key=True)
    order_id = Column(BigInteger, ForeignKey("orders.id"))
    book_id = Column(BigInteger, ForeignKey("book.id"))
    quantity = Column(Integer)
    price = Column(Numeric(5, 2))

    order = relationship("Order", back_populates="items")
    book = relationship("Book", back_populates="order_items")

class Order(Base):
    __tablename__ = 'orders'

    id = Column(BigInteger, primary_key=True)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    order_date = Column(TIMESTAMP)
    order_amount = Column(Numeric(6, 2))

    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class Review(Base):
    __tablename__ = 'review'

    id = Column(BigInteger, primary_key=True)
    book_id = Column(BigInteger, ForeignKey("book.id"))
    review_title = Column(String(120))
    review_details = Column(Text)
    review_date = Column(TIMESTAMP)
    rating_start = Column(Integer)

    book = relationship("Book", back_populates="reviews")

class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True)
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(70))
    password = Column(String(255))
    admin = Column(Boolean)

    orders = relationship("Order", back_populates="user")