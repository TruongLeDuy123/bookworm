from pydantic import BaseModel
from typing import List

class OrderBase(BaseModel):
    book_title: str
    author_name: str
    book_cover_photo: str
    price: float
    quantity: int
    total: float

    class Config:
        from_attributes = True
