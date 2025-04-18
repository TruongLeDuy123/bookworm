from pydantic import BaseModel

class UserBase(BaseModel):
    firstname: str
    lastname: str
    email: str

# class UserCreate(UserBase):
#     password: str
#     admin: int = 0

# class User(UserBase):
#     id: int

#     class Config:
#         orm_mode = True

# class Token(BaseModel):
#     access_token: str
#     token_type: str

# class UserOut(BaseModel):
#     id: int
#     username: str
#     email: str

#     class Config:
#         orm_mode = True
