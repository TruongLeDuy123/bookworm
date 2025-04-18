from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.all import User
from app.schemas.user import UserBase
from app.services import user as userService

router = APIRouter()

# @router.get("/users/me", response_model=UserOut)
# async def get_current_user(token: str=Depends(oauth2_schema), db: Session = Depends(get_db)):
#     user_id = validate_token_and_extract_user_id(token)
#     # print(user_id)
#     # Fetch user details from db using the user_id
#     user = crud.get_user_by_id(db, user_id)
#     if user is None:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user

@router.get("/user/{user_id}")
async def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = userService.get_user_by_id(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user