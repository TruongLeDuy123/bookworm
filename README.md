# Bookworm

Bookworm is a full-stack web application for managing books, authors, categories, orders, and reviews. The project consists of a FastAPI backend and a React frontend.

## Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy
- **Frontend:** React, Vite, Tailwind CSS
- **Database:** PostgreSQL

## Project Structure

```
bookworm/
│
├── app/                # FastAPI backend
│   ├── models/         # SQLAlchemy models
│   ├── routers/        # API route handlers
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   ├── database.py     # Database connection
│   ├── main.py         # FastAPI app entrypoint
│   └── ...
│
├── bookworm-react/     # React frontend
│   ├── src/
│   ├── public/
│   └── ...
│
├── seed.py             # Database seeding script
├── README.md
└── package.json
```

## Getting Started

### Backend

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
2. Run the FastAPI server:
   ```
   uvicorn app.main:app --reload
   ```

### Frontend

1. Install dependencies:
   ```
   cd bookworm-react
   npm install
   ```
2. Start the development server:
   ```
   npm run dev
   ```

## API

The backend exposes RESTful endpoints for users, books, authors, categories, orders, reviews, and authentication. See the `app/routers/` directory for details.

