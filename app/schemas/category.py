from pydantic import BaseModel
from decimal import Decimal

class CategoryBase(BaseModel):
    id: int
    category_name: str
    


