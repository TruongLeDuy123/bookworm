from pydantic import BaseModel
from decimal import Decimal

class BookBase(BaseModel):
    book_title: str
    book_summary: str
    book_price: float
    book_cover_photo: str

    class Config:
        from_attributes = True  # Thêm dòng này để sử dụng from_orm


class AuthorSchema(BaseModel):
    id: int
    author_name: str

    class Config:
        from_attributes = True

class CategorySchema(BaseModel):
    id: int
    category_name: str

    class Config:
        from_attributes = True

class DiscountSchema(BaseModel):
    id: int
    discount_price: Decimal  

    class Config:
        from_attributes = True  

class BookDiscountSchema(BaseModel):
    book_id: int
    discount: DiscountSchema


class BookSchema(BookBase):
    id: int
    book_title: str
    book_price: float
    book_cover_photo: str
    author: AuthorSchema
    category: CategorySchema
    class Config:
        from_attributes = True

