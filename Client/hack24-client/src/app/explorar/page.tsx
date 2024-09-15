"use client";

import TeacherPayCard from "@/components/explorar/TeacherPayCard";
import { useEffect, useState } from "react";
import ModalExplorarProfesor from "@/components/explorar/ModalExplorarProfesor";
import FormFilter from "@/components/explorar/filter/FormFilter";
import "@/styles/explorar/Explorar.css";
import axios from "axios";
import { API_BASE_URL } from "../constants";


const grados = ["Avanzado", "Intermedio", "Principiante"];

type Appointment = {
  appointment_id: number;
  appointment_timestamp: string;
  status: string;
};

type CardFetch = {
  appointments: Appointment[];
  category_id: number;
  category_name: string;
  course_id: number;
  course_description: string;
  level: string;
  course_name: string;
  pathtopic: string;
  teacher_id: number;
  teacher_name: string;
  teacher_rating: string;
};

type Course = {
  price: number;
  course: CardFetch;
};

type Category = {
  id: number;
  name: string;
};

const getRandomPrice = () => {
  return Math.floor(Math.random() * (400 - 100 + 1)) + 100;
};

export default function Explorar() {
  const [openModal, setOpenModal] = useState(false);

  const [modalPrice, setModalPrice] = useState(200);
  const [modalCourseData, setModalCourseData] = useState<CardFetch>();

  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesID, setCategoriesID] = useState<Category[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [courses, setCourses] = useState<CardFetch[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getCategories`);
        const categoryIDs = response.data;
        const categoryNames = response.data.map(
          (category: { name: string }) => category.name
        );
        setCategoriesID(categoryIDs);
        setCategories(categoryNames);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getCourses`);
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
    fetchCategories();
    setGrades(grados);
  }, []);

  const [filteredCategory, setFilteredCategory] = useState<string[]>([]);
  const [filteredGrade, setFilteredGrade] = useState<string[]>([]);

  const onSubmitFilters = (
    filteredCategory: string[],
    filteredGrade: string[]
  ) => {
    setFilteredCategory(filteredCategory);
    setFilteredGrade(filteredGrade);
  };

  const onClickMoreInfo = ({ course, price }: Course) => {
    setModalPrice(price);
    setModalCourseData(course);
    toggleModalHandler();
  };

  const toggleModalHandler = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="explorar-main-container">
      <div>
        <FormFilter
          categories={categories}
          grades={grades}
          onSubmitFilters={onSubmitFilters}
        />
      </div>
      <div className="explorar-cards-container">
        {courses
          .filter((course) => {
            const selectedCategoryIDs = filteredCategory.map(
              (name) =>
                categoriesID.find((category) => category.name === name)?.id
            );

            return (
              (filteredCategory.length === 0 ||
                selectedCategoryIDs.includes(course.category_id)) &&
              (filteredGrade.length === 0 ||
                filteredGrade.includes(course.level))
            );
          })
          .map((course, index) => (
            <TeacherPayCard
              key={index}
              name={course.course_name}
              image={course.pathtopic}
              rating={parseFloat(course.teacher_rating)}
              description={course.course_description}
              category={
                categoriesID.find(
                  (category) => category.id === course.category_id
                )?.name || "Unknown"
              }
              grade={course.level}
              price={getRandomPrice()}
              professorName={course.teacher_name}
              course={course}
              toggleModal={onClickMoreInfo}
            />
          ))}
      </div>
      {openModal && (
        <ModalExplorarProfesor
          price={modalPrice}
          toggleModal={toggleModalHandler}
          datosCurso={modalCourseData}
        />
      )}
    </div>
  );
}
