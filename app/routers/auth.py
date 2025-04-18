from fastapi import APIRouter, Depends, HTTPException, status
# from app.schemas.user import User, UserCreate, UserOut, Token
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth import  login
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

# @router.post("/register", response_model=User)
# async def register_user(user: UserCreate, db: Session = Depends(get_db)):
#     return await register(user, db)
    
@router.post("/login")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm=Depends(), db: Session=Depends(get_db)):
    return await login(form_data, db)

