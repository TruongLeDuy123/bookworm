# from sqlalchemy import Column, String, Text, BigInteger
# from sqlalchemy.orm import relationship
# from app.database import Base
# from app.models.book import Book

# class Author(Base):
#     __tablename__ = 'author'

#     id = Column(BigInteger, primary_key=True)
#     author_name = Column(String(255))
#     author_bio = Column(Text)

#     books = relationship("Book", back_populates="author")