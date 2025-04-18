# from sqlalchemy import Column, Integer, BigInteger, Numeric, ForeignKey
# from sqlalchemy.orm import relationship
# from app.database import Base

# class OrderItem(Base):
#     __tablename__ = 'order_item'

#     id = Column(BigInteger, primary_key=True)
#     order_id = Column(BigInteger, ForeignKey("orders.id"))
#     book_id = Column(BigInteger, ForeignKey("book.id"))
#     quantity = Column(Integer)
#     price = Column(Numeric(5, 2))

#     order = relationship("Order", back_populates="items")
#     book = relationship("Book", back_populates="order_items")
