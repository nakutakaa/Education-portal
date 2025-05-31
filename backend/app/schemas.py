
from pydantic import BaseModel, EmailStr
from typing import Optional

# --- User Schemas ---

class UserBase(BaseModel):
    """Base schema for User common attributes."""
    username: str
    email: EmailStr
    role: str = "student"

class UserCreate(UserBase):
    """Schema for creating a new User (includes password)."""
    password: str

class UserResponse(UserBase):
    """Schema for returning User data (does not include password)."""
    id: int
    class Config:
        from_attributes = True

# --- Course Schemas ---

class CourseBase(BaseModel):
    """Base schema for Course common attributes."""
    title: str
    description: Optional[str] = None

class CourseCreate(CourseBase):
    """Schema for creating a new Course."""
    # When creating, teacher_id is required.
    teacher_id: int

class CourseResponse(CourseBase):
    """Schema for returning Course data."""
    id: int
    # *** THIS IS THE CRUCIAL FIX ***
    # Make teacher_id optional when reading from the database,
    # as some existing records might have it as None.
    teacher_id: Optional[int]
    teacher_username: Optional[str] = None

    class Config:
        from_attributes = True

