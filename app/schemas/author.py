from pydantic import BaseModel
from decimal import Decimal

class AuthorBase(BaseModel):
    id: int
    author_name: str
    


