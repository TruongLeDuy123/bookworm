# from sqlalchemy import Column, BigInteger, Numeric, Date, ForeignKey
# from sqlalchemy.orm import relationship
# from app.database import Base

# class Discount(Base):
#     __tablename__ = 'discount'

#     id = Column(BigInteger, primary_key=True)
#     book_id = Column(BigInteger, ForeignKey("book.id"))
#     discount_start_date = Column(Date)
#     discount_end_date = Column(Date)
#     discount_price = Column(Numeric(5, 2))

#     book = relationship("Book", back_populates="discounts")