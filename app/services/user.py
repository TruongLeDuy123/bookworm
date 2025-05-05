from sqlalchemy.orm import Session
from app.models.all import User

def get_user_by_id(db: Session, user_id):
    return db.query(User).filter(User.id == user_id).first()