from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
import os
from dotenv import load_dotenv

# Loads environment variables from the .env file
load_dotenv()

# Retrieve the database URL from environment variables
# Defaults to a test DB if DATABASE_URL is not found (useful fallback)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app/test.db")

# Configure the SQLAlchemy engine
# For SQLite, 'check_same_thread': False is needed for FastAPI's default sync functions
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# Configure a SessionLocal class to create database sessions
# 'autocommit=False' means changes aren't automatically saved
# 'autoflush=False' means objects aren't flushed to DB until commit or explicit flush
# 'bind=engine' links sessions to our database engine
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for our SQLAlchemy ORM models
class Base(DeclarativeBase):
    pass

# Dependency for FastAPI to get a database session for each request
# This ensures a session is created, used, and then properly closed.
def get_db():
    db = SessionLocal() # Create a new session
    try:
        yield db # Yield the session to the FastAPI endpoint
    finally:
        db.close() # Ensure the session is closed after the request is processed