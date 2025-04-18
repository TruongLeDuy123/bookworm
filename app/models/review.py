# from sqlalchemy import Column, String, Text, BigInteger, ForeignKey, TIMESTAMP
# from sqlalchemy.orm import relationship
# from app.database import Base


# class Review(Base):
#     __tablename__ = 'review'

#     id = Column(BigInteger, primary_key=True)
#     book_id = Column(BigInteger, ForeignKey("book.id"))
#     review_title = Column(String(120))
#     review_details = Column(Text)
#     review_date = Column(TIMESTAMP)
#     rating_start = Column(String(255))

#     book = relationship("Book", back_populates="reviews")

