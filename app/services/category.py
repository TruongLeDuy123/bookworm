from sqlalchemy.orm import Session
from app.models.all import Category

def get_all_categories_service(db: Session):
    return db.query(Category).order_by(Category.category_name).all()