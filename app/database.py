from sqlalchemy import create_engine, MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:123456@localhost/bookworm_app"
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create all db tables
Base = declarative_base()
Base.metadata.create_all(bind=engine) # Initialize Base

def get_db():
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()



