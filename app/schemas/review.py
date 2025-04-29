from pydantic import BaseModel

class ReviewCreate(BaseModel):
    book_id: int
    review_title: str
    review_details: str
    rating_start: int

    class config:
        from_attributes = True