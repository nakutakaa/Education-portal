from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models import User, Course # Import your models
from app.database import Base # Import Base for database connection (optional, but good practice)
import os
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

# Get database URL from environment variable, with a fallback for safety
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./app/test.db")

# Setup the SQLAlchemy engine
# Using connect_args for SQLite to avoid threading issues in some contexts
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})

# Setup a sessionmaker, similar to what we have in database.py
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_data():
    """Function to populate the database with initial sample data."""
    db = SessionLocal() # Get a database session
    try:
        print("\n--- Seeding Database ---")

        # --- Optional: Uncomment the line below if you want to create tables using models.py directly
        # This is typically used for very simple projects without Alembic.
        # With Alembic, schema management is separate.
        # Base.metadata.create_all(bind=engine)

        # --- Clear existing data for consistent seeding ---
        # It's good practice to delete child records (Courses) before parent records (Users)
        # if there are foreign key constraints, to avoid errors.
        print("Clearing existing data...")
        db.query(Course).delete()
        db.query(User).delete()
        db.commit() # Commit the deletions
        print("Existing data cleared.")

        # --- Create Users ---
        print("Creating sample users...")
        admin_user = User(
            username="admin_user",
            email="admin@smarteredu.com",
            hashed_password="adminpassword", # Placeholder: In real app, this would be hashed
            role="admin"
        )
        teacher_user = User(
            username="teacher_alice",
            email="alice.smith@smarteredu.com",
            hashed_password="teacherpassword",
            role="teacher"
        )
        student_user = User(
            username="student_bob",
            email="bob.johnson@smarteredu.com",
            hashed_password="studentpassword",
            role="student"
        )

        db.add_all([admin_user, teacher_user, student_user]) # Add users to the session
        db.commit() # Commit the users to the database
        # Refresh objects to get their database-assigned IDs (crucial for foreign keys)
        db.refresh(admin_user)
        db.refresh(teacher_user)
        db.refresh(student_user)
        print("Sample users created.")

        # --- Create Courses ---
        print("Creating sample courses...")
        course1 = Course(
            title="Introduction to Python Programming",
            description="A beginner-friendly course covering Python fundamentals.",
            teacher_id=teacher_user.id # Link to teacher_alice by her ID
        )
        course2 = Course(
            title="Advanced React Development",
            description="Dive deep into React hooks, context API, and performance optimization.",
            teacher_id=teacher_user.id # Link to teacher_alice
        )
        course3 = Course(
            title="Database Management with SQLAlchemy and FastAPI",
            description="Learn to build robust APIs with FastAPI and manage databases with SQLAlchemy.",
            teacher_id=admin_user.id # Admin can also 'teach' for demo purposes
        )

        db.add_all([course1, course2, course3]) # Add courses to the session
        db.commit() # Commit the courses to the database
        print("Sample courses created.")

        print("--- Seeding Complete! Database is populated! ---")

    except Exception as e:
        db.rollback() # Rollback changes if any error occurs
        print(f"\nAn error occurred during seeding: {e}")
        print("Seeding failed. Database rolled back.")
    finally:
        db.close() # Always close the session

if __name__ == "__main__":
    seed_data()