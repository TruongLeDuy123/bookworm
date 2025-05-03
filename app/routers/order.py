from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.order import OrderCreate
from app.services.order import create_order_service

router = APIRouter()

@router.post("/orders")
async def create_order(order_data: OrderCreate, db: Session = Depends(get_db)):
    return create_order_service(order_data, db)
