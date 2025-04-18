# from sqlalchemy import Column, String, BigInteger
# from sqlalchemy.orm import relationship
# from app.database import Base
# from app.models.book import Book

# class Category(Base):
#     __tablename__ = 'category'

#     id = Column(BigInteger, primary_key=True)
#     category_name = Column(String(120))
#     category_desc = Column(String(255))

#     books = relationship("Book", back_populates="category")