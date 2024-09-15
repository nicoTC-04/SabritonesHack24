"use client";
import React, { useEffect, useState, useRef } from "react";
import SearchBar from "../components/landing/searchbar";
import "./../styles/landing/landing.css";
import TeacherCard from "@/components/landing/teacherCard";
import RatingCard from "@/components/landing/RatingCard";
//import UniPic from "./Uni.jpg"

interface Appointment {
  appointment_id: number;
  appointment_timestamp: string;
  status: string;
}

interface Course {
  appointments: Appointment[];
  category_id: number;
  course_description: string;
  course_id: number;
  course_name: string;
  level: string;
  pathtopic: string;
  teacher_id: number;
  teacher_name: string;
  teacher_rating: string;
}

interface Category {
  category_id: number;
  category_name: string;
}

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const mathCarouselRef = useRef<HTMLDivElement>(null);
  const englishCarouselRef = useRef<HTMLDivElement>(null);
  const historyCarouselRef = useRef<HTMLDivElement>(null);
  const programmingCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://216.238.66.189:5000/getCourses");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setCourses(data);
      } catch (error) {
        console.error("There was an error fetching the courses!", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://216.238.66.189:5000/getCategories"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setCategories(data);
      } catch (error) {
        console.error("There was an error fetching the categories!", error);
      }
    };

    fetchCourses();
    fetchCategories();
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
  const mathCourses = courses.filter((course) => course.category_id === 1);
  const englishCourses = courses.filter((course) => course.category_id === 3);
  const historyCourses = courses.filter((course) => course.category_id === 5);
  const programmingCourses = courses.filter(
    (course) => course.category_id === 4
  );

  return (
    <div className="landingContainer">
      <div className="landingHeader">
        <div className="landingHeaderContent">
          <h1 className="header">Encuentra a tu nuevo Profesor</h1>
          <div className="searchContainer">
            <SearchBar />
          </div>
        </div>
      </div>

      <div>
        <div>
          <div className="leftContainer">
            <h3>Matemáticas</h3>
          </div>
          <div className="carousel-container">
            <button
              className="carousel-button left"
              onClick={() => scrollLeft(mathCarouselRef)}
            >
              &#9664;
            </button>
            <div className="carousel" ref={mathCarouselRef}>
              {mathCourses.map((course) => (
                <TeacherCard key={course.course_id} course={course} />
              ))}
            </div>
            <button
              className="carousel-button right"
              onClick={() => scrollRight(mathCarouselRef)}
            >
              &#9654;
            </button>
          </div>
        </div>

        <div>
          <div className="leftContainer">
            <h3>Ingles</h3>
          </div>
          <div className="carousel-container">
            <button
              className="carousel-button left"
              onClick={() => scrollLeft(englishCarouselRef)}
            >
              &#9664;
            </button>
            <div className="carousel" ref={englishCarouselRef}>
              {englishCourses.map((course) => (
                <TeacherCard key={course.course_id} course={course} />
              ))}
            </div>
            <button
              className="carousel-button right"
              onClick={() => scrollRight(englishCarouselRef)}
            >
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
              name: "Carlos Mtz",
              score: 5,
              review: "Carlos Mtz es un profesor de matemáticas con un método claro y eficaz. Sus explicaciones concisas y su disposición para resolver dudas de manera rápida hacen que sus clases sean muy útiles y productivas.",
              image: "carlos.jpeg",
            }}
          />
          <RatingCard
            review={{
              name: "German Salas",
              score: 4,
              review: "Germán Salas es un profesor de literatura apasionado que ofrece análisis profundos de los textos. Su entusiasmo y capacidad para motivar a los estudiantes enriquecen la experiencia educativa.",
              image: "german.jpeg",
            }}
          />
          <RatingCard
            review={{
              name: "Emilio Dominguez",
              score: 3,
              review: "Emilio Dominguez es un excelente profesor de ciencias sociales. Su enfoque dinámico y su habilidad para conectar los temas con ejemplos actuales mantienen a los estudiantes interesados y participativos en clase.",
              image: "emi.jpeg",
            }}
          />
        </div>

        <div>
          <div className="leftContainer">
            <h3>Historia</h3>
          </div>
          <div className="carousel-container">
            <button
              className="carousel-button left"
              onClick={() => scrollLeft(historyCarouselRef)}
            >
              &#9664;
            </button>
            <div className="carousel" ref={historyCarouselRef}>
              {historyCourses.map((course) => (
                <TeacherCard key={course.course_id} course={course} />
              ))}
            </div>
            <button
              className="carousel-button right"
              onClick={() => scrollRight(historyCarouselRef)}
            >
              &#9654;
            </button>
          </div>
        </div>

        <div>
          <div className="leftContainer">
            <h3>Programación</h3>
          </div>
          <div className="carousel-container">
            <button
              className="carousel-button left"
              onClick={() => scrollLeft(programmingCarouselRef)}
            >
              &#9664;
            </button>
            <div className="carousel" ref={programmingCarouselRef}>
              {programmingCourses.map((course) => (
                <TeacherCard key={course.course_id} course={course} />
              ))}
            </div>
            <button
              className="carousel-button right"
              onClick={() => scrollRight(programmingCarouselRef)}
            >
              &#9654;
            </button>
          </div>
        </div>
      </div>

      <div className="footerLanding">
        <h3>Se parte del siguiente paso en la</h3>
        <h2>Evolución Educativa</h2>
        <button className="footerBtn">Registrate como maestro</button>
      </div>
    </div>
  );
}
