-- Drop tables if they exist
DROP TABLE IF EXISTS my_schema.Classes;
DROP TABLE IF EXISTS my_schema.Appointments;
DROP TABLE IF EXISTS my_schema.Courses;
DROP TABLE IF EXISTS my_schema.Teachers;
DROP TABLE IF EXISTS my_schema.Categories;
DROP TABLE IF EXISTS my_schema.Users;

-- Create the schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS my_schema;

-- Create the Users table
CREATE TABLE my_schema.Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    region VARCHAR(100),
    timezone VARCHAR(50),
    teacher BOOLEAN
);

-- Create the Teachers table (with reference to Users)
CREATE TABLE my_schema.Teachers (
    user_id INT PRIMARY KEY REFERENCES my_schema.Users(id),
    rating NUMERIC(3, 2)
);

-- Create the Categories table
CREATE TABLE my_schema.Categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);

-- Create the Courses table (with references to Teachers and Categories)
CREATE TABLE my_schema.Courses (
    course_id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES my_schema.Teachers(user_id),
    name VARCHAR(100),
    category_id INT REFERENCES my_schema.Categories(id)
);

-- Create the Appointments table (with reference to Teachers)
CREATE TABLE my_schema.Appointments (
    id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES my_schema.Teachers(user_id),
    status VARCHAR(50),
    timestamp TIMESTAMP
);

-- Create the Classes table (with references to Courses and Users as Students)
CREATE TABLE my_schema.Classes (
    id SERIAL PRIMARY KEY,
    course_id INT REFERENCES my_schema.Courses(course_id),
    student_id INT REFERENCES my_schema.Users(id),
    timestamp TIMESTAMP,
    duration INTERVAL,
    path_video VARCHAR(255),
    summary TEXT
);