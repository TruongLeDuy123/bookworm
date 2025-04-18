# from sqlalchemy import Column, BigInteger, Numeric, ForeignKey, TIMESTAMP
# from sqlalchemy.orm import relationship
# from app.database import Base
# from app.models.order_item import OrderItem

# class Order(Base):
#     __tablename__ = 'orders'

#     id = Column(BigInteger, primary_key=True)
#     user_id = Column(BigInteger, ForeignKey("users.id"))
#     order_date = Column(TIMESTAMP)
#     order_amount = Column(Numeric(6, 2))

#     user = relationship("User", back_populates="orders")
#     items = relationship("OrderItem", back_populates="order")

