from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.auth import login, refresh_access_token, logout
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/login")
async def login_for_access_token(response: Response, form_data: OAuth2PasswordRequestForm=Depends(), db: Session=Depends(get_db)):
    return await login(response, form_data, db)

@router.post("/refresh-token")
async def refresh_token(request: Request, response: Response, db: Session = Depends(get_db)):
    return await refresh_access_token(request, response, db)

@router.post("/logout")
async def logout_route(response: Response):
    return await logout(response)