"use client";
import React, { useEffect, useState, useRef } from "react";
import SearchBar from "../components/landing/searchbar";
import "./../styles/landing/landing.css";
import TeacherCard from "@/components/landing/teacherCard";
import RatingCard from "@/components/landing/RatingCard";

interface Course {
  appointments: number[];
  course_id: number;
  level: string;
  name: string;
  pathtopic: string;
  rating: string;
  user_id: number;
  category_name: string; // Added category_name
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const mathCarouselRef = useRef<HTMLDivElement>(null);
  const englishCarouselRef = useRef<HTMLDivElement>(null);
  const historyCarouselRef = useRef<HTMLDivElement>(null);
  const programmingCarouselRef = useRef<HTMLDivElement>(null);

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

  const scrollLeft = (carouselRef: React.RefObject<HTMLDivElement>) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (carouselRef: React.RefObject<HTMLDivElement>) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Filtered courses by category
  const mathCourses = courses.filter((course) => course.category_name === "Matemáticas");
  const englishCourses = courses.filter((course) => course.category_name === "Español");
  const historyCourses = courses.filter((course) => course.category_name === "Historia");
  const programmingCourses = courses.filter((course) => course.category_name === "Computación");

  return (
    <div>
      <div className="Banner">
        <h1 className="header">Encuentra a tu nuevo Profesor</h1>
      </div>
      <div className="CenteredContainer">
        <SearchBar />
      </div>

      <div>
        <div>
          <div className="leftContainer">
            <h3>Matemáticas</h3>
          </div>
          <div className="carousel-container">
            <button className="carousel-button left" onClick={() => scrollLeft(mathCarouselRef)}>
              &#9664;
            </button>
            <div className="carousel" ref={mathCarouselRef}>
              {mathCourses.map((course) => (
                <TeacherCard key={course.course_id} course={course} />
              ))}
            </div>
            <button className="carousel-button right" onClick={() => scrollRight(mathCarouselRef)}>
              &#9654;
            </button>
          </div>
        </div>

        <div>
          <div className="leftContainer">
            <h3>Español</h3>
          </div>
          <div className="carousel-container">
            <button className="carousel-button left" onClick={() => scrollLeft(englishCarouselRef)}>
              &#9664;
            </button>
            <div className="carousel" ref={englishCarouselRef}>
              {englishCourses.map((course) => (
                <TeacherCard key={course.course_id} course={course} />
              ))}
            </div>
            <button className="carousel-button right" onClick={() => scrollRight(englishCarouselRef)}>
              &#9654;
            </button>
          </div>
        </div>

        <div className="CenteredContainer">
          <h3>Testimonios</h3>
        </div>

        <div className="testimonialContainer">
          <RatingCard
            review={{
              name: "John Doe",
              score: 5,
              review: "Excelente profesor, muy recomendado.",
              image: "stat",
            }}
          />
          <RatingCard
            review={{
              name: "Jane Doe",
              score: 4,
              review: "Buen profesor, muy paciente.",
              image: "stat",
            }}
          />
          <RatingCard
            review={{
              name: "John Smith",
              score: 3,
              review: "Regular profesor, se puede mejorar.",
              image: "stat",
            }}
          />
        </div>

        <div>
          <div className="leftContainer">
            <h3>Historia</h3>
          </div>
          <div className="carousel-container">
            <button className="carousel-button left" onClick={() => scrollLeft(historyCarouselRef)}>
              &#9664;
            </button>
            <div className="carousel" ref={historyCarouselRef}>
              {historyCourses.map((course) => (
                <TeacherCard key={course.course_id} course={course} />
              ))}
            </div>
            <button className="carousel-button right" onClick={() => scrollRight(historyCarouselRef)}>
              &#9654;
            </button>
          </div>
        </div>

        <div>
          <div className="leftContainer">
            <h3>Programación</h3>
          </div>
          <div className="carousel-container">
            <button className="carousel-button left" onClick={() => scrollLeft(programmingCarouselRef)}>
              &#9664;
            </button>
            <div className="carousel" ref={programmingCarouselRef}>
              {programmingCourses.map((course) => (
                <TeacherCard key={course.course_id} course={course} />
              ))}
            </div>
            <button className="carousel-button right" onClick={() => scrollRight(programmingCarouselRef)}>
              &#9654;
            </button>
          </div>
        </div>
      </div>

      <div className="footerLanding">
        <h3>Se parte del siguiente paso en la</h3>
        <h2>Evolución Educativa</h2>
      </div>
    </div>
  );
}