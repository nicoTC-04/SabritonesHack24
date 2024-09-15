-- Drop tables if they exist
DROP TABLE IF EXISTS my_schema.Classes;
DROP TABLE IF EXISTS my_schema.Appointments;
DROP TABLE IF EXISTS my_schema.Courses;
DROP TABLE IF EXISTS my_schema.Teachers;
DROP TABLE IF EXISTS my_schema.Categories;
DROP TABLE IF EXISTS my_schema.Users;

-- Create the schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS my_schema;

-- Create the Users table with username and password fields
CREATE TABLE my_schema.Users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    region VARCHAR(100),
    timezone VARCHAR(50),
    teacher BOOLEAN,
    password VARCHAR(255)
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

-- Create the Courses table (with references to Teachers, Categories and added level field and pathToPic column)
CREATE TABLE my_schema.Courses (
    course_id SERIAL PRIMARY KEY,
    teacher_id INT REFERENCES my_schema.Teachers(user_id),
    name VARCHAR(100),
    category_id INT REFERENCES my_schema.Categories(id),
    level VARCHAR(50),
    pathToPic VARCHAR(255)  -- Added pathToPic field
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

-- Insert sample data into Users table
INSERT INTO my_schema.Users (username, name, region, timezone, teacher, password)
VALUES
('juanPerez','Juan Pérez', 'Latinoamérica', 'GMT-6', TRUE, 'password'),
('anaGomez','Ana Gómez', 'Europa', 'GMT+1', TRUE, 'password'),
('carlosMtz','Carlos Martínez', 'Norteamérica', 'GMT-5', TRUE, 'password'),
('luisFdz','Luis Fernández', 'Latinoamérica', 'GMT-6', TRUE, 'password'),
('mariaRDZ','María Rodríguez', 'Europa', 'GMT+1', TRUE, 'password'),
('sofiaHrz','Sofía Hernández', 'Norteamérica', 'GMT-5', TRUE, 'password');

-- Insert sample data into Teachers table
INSERT INTO my_schema.Teachers (user_id, rating)
VALUES
(1, 4.8),
(2, 4.5),
(3, 4.7),
(4, 4.9),
(5, 4.6),
(6, 4.4);

-- Insert sample data into Categories table
INSERT INTO my_schema.Categories (name)
VALUES
('Matemáticas'),
('Ciencias'),
('Química'),
('Historia'),
('Tecnología'),
('Literatura'),
('Bases de Datos'),
('Economía'),
('Filosofía'),
('Marketing');

-- Insert sample data into Courses table
INSERT INTO my_schema.Courses (teacher_id, name, category_id, level, pathToPic)
VALUES
(1, 'Álgebra 101', 1, 'Principiante', 'path_to_pic_1.jpg'),
(1, 'Biología Básica', 2, 'Intermedio', 'path_to_pic_2.jpg'),
(2, 'Física Avanzada', 2, 'Avanzado', 'path_to_pic_3.jpg'),
(2, 'Química Orgánica', 3, 'Intermedio', 'path_to_pic_4.jpg'),
(3, 'Historia del Arte', 4, 'Principiante', 'path_to_pic_5.jpg'),
(4, 'Programación en Python', 5, 'Intermedio', 'path_to_pic_6.jpg'),
(5, 'Cálculo Diferencial', 1, 'Avanzado', 'path_to_pic_7.jpg'),
(6, 'Literatura Española', 6, 'Principiante', 'path_to_pic_8.jpg'),
(1, 'Desarrollo Web con React', 5, 'Avanzado', 'path_to_pic_9.jpg'),
(2, 'Bases de Datos con Postgres', 7, 'Intermedio', 'path_to_pic_10.jpg'),
(3, 'Economía Básica', 8, 'Principiante', 'path_to_pic_11.jpg'),
(4, 'Introducción a la Filosofía', 9, 'Principiante', 'path_to_pic_12.jpg'),
(5, 'Historia de México', 4, 'Intermedio', 'path_to_pic_13.jpg'),
(6, 'Marketing Digital', 10, 'Intermedio', 'path_to_pic_14.jpg'),
(1, 'Desarrollo de Apps Móviles', 5, 'Avanzado', 'path_to_pic_15.jpg'),
(2, 'Geometría Euclidiana', 1, 'Principiante', 'path_to_pic_16.jpg');

-- Insert sample data into Appointments table
INSERT INTO my_schema.Appointments (teacher_id, status, timestamp)
VALUES
(1, 'Scheduled', '2024-09-15 10:00:00'),
(2, 'Completed', '2024-09-14 14:00:00');

-- Insert sample data into Classes table
INSERT INTO my_schema.Classes (course_id, student_id, timestamp, duration, path_video, summary)
VALUES
(1, 2, '2024-09-15 10:00:00', '1 hour', 'video_link_1', 'Clases de Matemáticas'),
(2, 2, '2024-09-16 11:00:00', '2 hours', 'video_link_2', 'Clases de Biología');

-- Select from Users table to verify
SELECT * FROM my_schema.Users;