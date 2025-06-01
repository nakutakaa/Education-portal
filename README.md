# Smarter Education Portal
 
 ## -- BACKEND --

This project is a full-stack application for a simple education portal, featuring a FastAPI backend with SQLAlchemy and Alembic for database management, and a React frontend for user interaction.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Backend Setup](#backend-setup)
    - [1. Clone the Repository](#1-clone-the-repository)
    - [2. Navigate to Backend Directory](#2-navigate-to-backend-directory)
    - [3. Create and Activate Virtual Environment](#3-create-and-activate-virtual-environment)
    - [4. Install Backend Dependencies](#4-install-backend-dependencies)
    - [5. Database Initialization (Alembic)](#5-database-initialization-alembic)
    - [6. Database Seeding](#6-database-seeding)
    - [7. Run the FastAPI Backend](#7-run-the-fastapi-backend)
    - [8. Backend Verification](#8-backend-verification)
- [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contribution](#contribution)
- [License](#license)

---

## Project Overview
The Smarter Education Portal aims to provide a basic platform for managing users (admins, teachers, students) and educational courses. The backend is built with **FastAPI** for robust API endpoints, **SQLAlchemy** for ORM, and **Alembic** for database migrations. The frontend will be built with **React**, **Tailwind CSS**, and **React Toastify**.

## Features
### Backend
- **User Management:** Create, Read (all, by ID) users.
- **Course Management:** Create, Read (all, by ID), Update, Delete courses.
- **Database Migrations:** Schema changes managed with Alembic.
- **Data Seeding:** Script to populate initial database data for development.
- **Interactive API Docs:** Auto-generated Swagger UI (`/docs`) and Redoc (`/redoc`).

### Frontend 
- Display list of users.
- Display list of courses.
- Form to create new users.
- Real-time notifications using Toastify.

---

## Prerequisites
Before you begin, ensure you have the following installed:
- **Python 3.9+**
- **pip** (Python package installer)
- **Node.js** (LTS version recommended)
- **npm** (Node.js package manager, comes with Node.js)
- **Git**

---

## Backend Setup

Follow these steps to get the FastAPI backend up and running.

### 1. Clone the Repository
First, clone the project repository to your local machine:

cd smarter-education-portal

### 2. Navigate to Backend Directory

All backend-related operations will be performed from within the backend directory.
Bash

cd backend

### 3. Create and Activate Virtual Environment

It's highly recommended to use a virtual environment to manage project dependencies.
Bash

python -m venv venv

On macOS/Linux:
Bash

source venv/bin/activate

On Windows:
Bash

.\venv\Scripts\activate

(You should see (venv) or (backend) in your terminal prompt, indicating the virtual environment is active.)
### 4. Install Backend Dependencies

Install all required Python packages.
Bash

pip install fastapi uvicorn "SQLAlchemy<2.0" alembic python-dotenv # sqlite3 is usually built-in

To generate requirements.txt (recommended for future sharing/setup):
Bash

pip freeze > requirements.txt

(If you generate requirements.txt, remember to git add requirements.txt and commit it.)
### 5. Database Initialization (Alembic)

Initialize and apply database migrations to create the necessary tables.
Bash

alembic revision --autogenerate -m "Initialize Alembic and create initial user and course tables"
alembic upgrade head

(This creates your education.db file and the users and courses tables.)
### 6. Database Seeding

Populate your database with initial sample data for development and testing.
Bash

python seed.py

You can verify the data using sqlite3:
Bash

sqlite3 app/education.db
SELECT COUNT(*) FROM users;
SELECT id, username, email, role FROM users;
SELECT COUNT(*) FROM courses;
SELECT id, title, teacher_id FROM courses;
.quit

### 7. Run the FastAPI Backend

Start the FastAPI development server. This will also make the interactive API documentation available.
Bash

uvicorn app.main:app --reload

(Keep this terminal window open and running the server.)
### 8. Backend Verification

Open your web browser and navigate to the following URLs to verify the backend is running and the API endpoints are accessible:

    Root Endpoint: http://127.0.0.1:8000 (Should show: {"message": "Welcome to the Smarter Education API!"})
    Interactive API Documentation (Swagger UI): http://127.0.0.1:8000/docs
    Alternative API Documentation (Redoc): http://127.0.0.1:8000/redoc

Test Endpoints via Swagger UI (/docs):

    GET /users/: Click "Try it out" and "Execute" to see your seeded users.
    GET /courses/: Click "Try it out" and "Execute" to see your seeded courses (check if teacher_username is populated).
    POST /users/: "Try it out", edit the request body with new unique user details, and "Execute" to create a new user.
    POST /courses/: "Try it out", edit the request body (use a valid teacher_id like 1 or 2), and "Execute" to create a new course.

```bash

Repository Link: git@github.com:nakutakaa/Education-portal.git

## -- FRONTEND --

Frontend Application (React)

This repository contains the React-based frontend application for the Smarter Education Portal. It provides a user interface to interact with the FastAPI backend, allowing for user and course management.
### Setup and Installation

Follow these steps to get the frontend application up and running on your local machine.
Prerequisites

Before you begin, ensure you have the following installed:

    Node.js: Download & Install Node.js (Includes npm)
    npm (Node Package Manager) or Yarn: Usually comes with Node.js, or install Yarn separately.
    Git: Download & Install Git

### Installation Steps

    Clone the repository:
    If you haven't already, clone your project repository to your local machine:
    Bash

 git clone <your-repository-url>
 cd <your-project-directory>/frontend-app

 (Replace <your-repository-url> and <your-project-directory> with your actual repository and project folder names.)

 Navigate to the frontend directory:
 Ensure your terminal is in the root directory of your frontend application (where package.json is located):
 Bash

 cd <path-to-your-frontend-folder>

 Install dependencies:
 Install all the necessary npm packages for the project:
 Bash

    npm install

### Running the Application

Once the dependencies are installed, you can start the development server.

    Start the development server:
    This command starts the Vite development server, which will open the application in your browser:
    Bash

    npm run dev

    The application will typically be accessible at http://localhost:5173 (or another port if 5173 is in use).

    Ensure Backend is Running:
    The frontend communicates with the backend. Make sure your FastAPI backend is also running on http://127.0.0.1:8000 for full functionality.

### Key Features

    User Management: Create, list, and delete users.
    Course Management: Create, list, edit, and delete courses.
    Interactive Notifications: Uses react-toastify for user feedback.

### Technologies Used

    React: JavaScript library for building user interfaces.
    Vite: Next-generation frontend tooling for fast development.
    Tailwind CSS: Utility-first CSS framework for styling.
    Axios (or native fetch API): For making HTTP requests to the backend.
    react-toastify: For displaying toast notifications.
