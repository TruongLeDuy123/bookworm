from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.database import get_db
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from app.models.all import User
# from app.schemas.user import UserCreate, UserOut
# from app.services.user import create_user
oauth2_schema = OAuth2PasswordBearer(tokenUrl="token")

# JWT authentication settings
SECRET_KEY = "your-secret-key" # Change this to a secure secret key
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing settings
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        return False
    return user

async def login(form_data: OAuth2PasswordRequestForm=Depends(), db: Session=Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        return {"error": "Invalid credentials"}
        # raise HTTPException(status_code=400, detail="Incorrect username or password")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "full_name": user.first_name + " " + user.last_name, "user_id": user.id}   
 

# @app.get("/users/me", response_model=UserOut)
# async def get_current_user(token: str=Depends(oauth2_schema), db: Session = Depends(get_db)):
#     user_id = validate_token_and_extract_user_id(token)
#     # print(user_id)
#     # Fetch user details from db using the user_id
#     user = crud.get_user_by_id(db, user_id)
#     if user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user

# def validate_token_and_extract_user_id(token: str) -> int:
#     try:
#         # Decode the JWT token to extract user information
#         # print(token)
#         decoded_token = jwt.decode(token, "your-secret-key", algorithms=["HS256"])
#         user_id = decoded_token.get("sub")
#         if user_id is None:
#             raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User ID not found in token")
#         return user_id
#     except JWTError:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
#     except jwt.ExpiredSignatureError:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
#     except ValueError:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")