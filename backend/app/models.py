from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base # Importing Base from our database setup

# --- User Model ---
class User(Base):
    __tablename__ = "users" # Maps this class to the 'users' table in the database

    id = Column(Integer, primary_key=True, index=True) # Unique identifier, auto increments
    username = Column(String, unique=True, index=True, nullable=False) # Unique username
    email = Column(String, unique=True, index=True, nullable=False) # Unique email address
    hashed_password = Column(String, nullable=False) # Placeholder for hashed password
    role = Column(String, default="student", nullable=False) # User's role (student, teacher, admin)

    # Relationship: A User (teacher) can teach many Courses
    # 'relationship' connects this model to the 'Course' model
    # 'back_populates' links this relationship back to the 'teacher' attribute on the Course model
    taught_courses = relationship("Course", back_populates="teacher")

    # String representation for easy debugging/printing of User objects
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"

# --- Course Model ---
class Course(Base):
    __tablename__ = "courses" # Maps this class to the 'courses' table in the database

    id = Column(Integer, primary_key=True, index=True) # Unique identifier
    title = Column(String, index=True, nullable=False) # Title of the course
    description = Column(String) # Optional description of the course

    # Foreign Key: Links this Course to a User (its teacher)
    # 'ForeignKey("users.id")' points to the 'id' column of the 'users' table
    teacher_id = Column(Integer, ForeignKey("users.id"))

    # Relationship: A Course belongs to one Teacher (many-to-one relationship)
    # 'relationship' connects this model to the 'User' model
    # 'back_populates' links this relationship back to the 'taught_courses' attribute on the User model
    teacher = relationship("User", back_populates="taught_courses")

    # String representation for easy debugging/printing of Course objects
    def __repr__(self):
        return f"<Course(id={self.id}, title='{self.title}')>"