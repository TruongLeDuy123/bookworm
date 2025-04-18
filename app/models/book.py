# from sqlalchemy import Column, String, Text, Integer, BigInteger, Numeric, ForeignKey
# from sqlalchemy.orm import relationship
# from app.database import Base
# from app.models.discount import Discount
# from app.models.review import Review
# from app.models.order_item import OrderItem
# class Book(Base):
#     __tablename__ = 'book'

#     id = Column(BigInteger, primary_key=True)
#     category_id = Column(BigInteger, ForeignKey("category.id"))
#     author_id = Column(BigInteger, ForeignKey("author.id"))
#     book_title = Column(String(255))
#     book_summary = Column(Text)
#     book_price = Column(Numeric(5, 2))
#     book_cover_photo = Column(String(20))

#     category = relationship("Category", back_populates="books")
#     author = relationship("Author", back_populates="books")
#     discounts = relationship("Discount", back_populates="book")
#     reviews = relationship("Review", back_populates="book")
#     order_items = relationship("OrderItem", back_populates="book")
