from pydantic import BaseModel

class UserBase(BaseModel):
    firstname: str
    lastname: str
    email: str
