from pydantic import BaseModel
from typing import List

class CartItem(BaseModel):
    book_id: int
    quantity: int
    price: float

class OrderCreate(BaseModel):
    user_id: int
    cart: List[CartItem]
