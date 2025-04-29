from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import user, auth, book, category, author, order, review

app = FastAPI()

# ✅ Thêm cấu hình CORS để cho phép frontend (React) gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # địa chỉ của frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(book.router)
app.include_router(category.router)
app.include_router(author.router)
app.include_router(order.router)
app.include_router(review.router)

