
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

# Importing database and models
from . import models, schemas
from .database import engine, get_db, Base

# Initializing the FastAPI application
app = FastAPI(
    title="Smarter Education API",
    description="API for managing users and courses in an education portal.",
    version="0.1.0"
)

origins = [
    "http://localhost",
    "http://localhost:5173", # Allow React frontend's origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This line is for development convenience and will create tables if they don't exist.
Base.metadata.create_all(bind=engine)

# --- Basic Root Endpoint ---
@app.get("/")
async def read_root():
    return {"message": "Welcome to the Smarter Education API!"}

# --- User Endpoints ---
@app.post("/users/", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # For now, storing plain password as a placeholder
    db_user = models.User(username=user.username, email=user.email, hashed_password=user.password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/", response_model=List[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = db.query(models.User).offset(skip).limit(limit).all()
    return users


@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(db_user)
    db.commit()
    # No content to return for 204 status, FastAPI handles this by default for 204
    return


# --- Course Endpoints ---

@app.post("/courses/", response_model=schemas.CourseResponse, status_code=status.HTTP_201_CREATED)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    
    # Checks if teacher_id exists and has 'teacher' or 'admin' role
    teacher = db.query(models.User).filter(models.User.id == course.teacher_id).first()
    if not teacher or teacher.role not in ["teacher", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid teacher ID or teacher role")
    

    db_course = models.Course(
        title=course.title,
        description=course.description,
        teacher_id=course.teacher_id
    )

    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    
    # Populate teacher_username for the response model
    # Changed from_attributes to from_orm
    response_course = schemas.CourseResponse.from_orm(db_course)
    response_course.teacher_username = teacher.username
    return response_course


@app.get("/courses/", response_model=List[schemas.CourseResponse])
def read_all_courses(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    courses = db.query(models.Course).offset(skip).limit(limit).all()
    # Manually populate teacher_username for each course
    response_courses = []
    for course in courses:
        # Changed from_attributes to from_orm
        response_course = schemas.CourseResponse.from_orm(course)
        if course.teacher:
            response_course.teacher_username = course.teacher.username
        else:
            response_course.teacher_username = None
        response_courses.append(response_course)
    return response_courses


@app.get("/courses/{course_id}", response_model=schemas.CourseResponse)
def read_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Changed from_attributes to from_orm
    response_course = schemas.CourseResponse.from_orm(course)
    if course.teacher:
        response_course.teacher_username = course.teacher.username
    return response_course

@app.put("/courses/{course_id}", response_model=schemas.CourseResponse)
def update_course(course_id: int, course_update: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    
    # Check if new teacher_id exists and has 'teacher' or 'admin' role
    if course_update.teacher_id != db_course.teacher_id:
        new_teacher = db.query(models.User).filter(models.User.id == course_update.teacher_id).first()
        if not new_teacher or new_teacher.role not in ["teacher", "admin"]:
            raise HTTPException(status_code=400, detail="Invalid new teacher ID or role")

    # Update attributes
    db_course.title = course_update.title
    db_course.description = course_update.description
    db_course.teacher_id = course_update.teacher_id

    db.commit()
    db.refresh(db_course)

    # Changed from_attributes to from_orm
    response_course = schemas.CourseResponse.from_orm(db_course)
    if db_course.teacher:
        response_course.teacher_username = db_course.teacher.username
    return response_course

@app.delete("/courses/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_course(course_id: int, db: Session = Depends(get_db)):
    db_course = db.query(models.Course).filter(models.Course.id == course_id).first()
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    db.delete(db_course)
    db.commit()
    return

