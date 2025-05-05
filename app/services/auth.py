import os
from fastapi import FastAPI, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from app.models.all import User
oauth2_schema = OAuth2PasswordBearer(tokenUrl="token")

# JWT authentication settings
SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key")  
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing settings
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def create_token(data: dict, expires_delta: timedelta, token_type: str):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({
        "exp": expire,
        "type": token_type  # access hoặc refresh
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_access_token(data: dict, expires_delta: timedelta):
    return create_token(data, expires_delta, "access")

def create_refresh_token(data: dict, expires_delta: timedelta):
    return create_token(data, expires_delta, "refresh")

def set_refresh_token_cookie(response: Response, refresh_token: str):
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        expires=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        samesite="lax",
        secure=False,  
        path="/"      
    )

def clear_refresh_token_cookie(response: Response):
    response.delete_cookie(
        key="refresh_token",
        samesite="lax",
        secure=False,  
        path="/"      
    )

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        return None
    return user

async def login(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token = create_access_token(
        data={
            "sub": user.email, 
            "full_name": f"{user.first_name} {user.last_name}",
            "user_id": user.id
        },
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    refresh_token = create_refresh_token(
        data={"sub": user.email},
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    )
    set_refresh_token_cookie(response, refresh_token)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "full_name": f"{user.first_name} {user.last_name}",
        "user_id": user.id
    }

async def logout(response: Response):
    clear_refresh_token_cookie(response)
    return {"message": "Logged out"}

def get_refresh_token_from_cookie(request: Request):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")
    return refresh_token

async def refresh_access_token(request: Request, response: Response, db: Session = Depends(get_db)):
    refresh_token = get_refresh_token_from_cookie(request)
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        email = payload.get("sub")
        user = db.query(User).filter(User.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        access_token = create_access_token(
            data={
                "sub": user.email,
                "full_name": f"{user.first_name} {user.last_name}",
                "user_id": user.id
            },
            expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        )
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "full_name": f"{user.first_name} {user.last_name}",
            "user_id": user.id
        }
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")