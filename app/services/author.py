from sqlalchemy.orm import Session
from app.models.all import Author

def get_all_authors(db: Session):
    return db.query(Author).order_by(Author.author_name).all()