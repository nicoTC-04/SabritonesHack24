"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/landing/searchbar";
import "./..//styles/landing/landing.css";
import TeacherCard from "@/components/landing/teacherCard";

interface Course {
  appointments: number[];
  course_id: number;
  level: string;
  name: string;
  pathtopic: string;
  rating: string;
  user_id: number;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    fetch("http://216.238.66.189:5000/getCourses")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        setCourses(data);
      })
      .catch((error) => {
        console.error("There was an error fetching the courses!", error);
      });
  }, []);


  return (
    <div>
      <div className="Banner">
        <h1 className="header">Encuentra a tu nuevo Profesor</h1>
      </div>
      <div className="CenteredContainer">
         <SearchBar />
      </div>

      <div>
        <h2>Profesores Destacados</h2>
      </div>

      <div>
        <h2>Categorías</h2>

        <div>
          <h3>Matematicas</h3>
          {courses.map((course) => {
            return (
              <TeacherCard
                key={course.course_id}
                course={course}
              />
            );
          }
          )}
        </div>

    </div>
    </div>
  );
}
