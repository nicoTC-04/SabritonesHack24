"use client";

import TeacherPayCard from "@/components/explorar/TeacherPayCard";
import { useEffect, useState } from "react";
import ModalExplorarProfesor from "@/components/explorar/ModalExplorarProfesor";
import FormFilter from "@/components/explorar/filter/FormFilter";
import "@/styles/explorar/Explorar.css";

const arrayTest = [
  {
    className: "Curso de Algebra Lineal",
    description:
      "Ofrezco material al alumno para que aprenda de una manera eficiente y podamos tener un buen vinculo alumno maestro",
    price: 200,
    professorName: "Emilio Dominguez",
    category: "Matematicas",
    grade: "Profesional",
    rating: 4.5,
  },
  {
    className: "Fisica",
    description:
      "Ofrezco material al alumno para que aprenda de una manera eficiente y podamos tener un buen vinculo alumno maestro",
    price: 200,
    professorName: "Emilio Dominguez",
    category: "Ciencias",
    grade: "Secundaria",
    rating: 4.0,
  },
  {
    className: "Quimica",
    description:
      "Proporciono recursos y guías para que el alumno comprenda los conceptos fundamentales de la química",
    price: 250,
    professorName: "Laura Martinez",
    category: "Ciencias",
    grade: "Secundaria",
    rating: 4.2,
  },
  {
    className: "Historia",
    description:
      "Enseño historia de una manera interactiva y dinámica para que el alumno se interese por el pasado",
    price: 180,
    professorName: "Carlos Perez",
    category: "Humanidades",
    grade: "Secundaria",
    rating: 3.8,
  },
  {
    className: "Ingles",
    description:
      "Clases de inglés con enfoque en conversación y comprensión auditiva para mejorar la fluidez del alumno",
    price: 220,
    professorName: "Ana Gonzalez",
    category: "Idiomas",
    grade: "Secundaria",
    rating: 4.7,
  },
  {
    className: "Programación",
    description:
      "Curso de programación desde cero, abarcando los conceptos básicos hasta avanzados con proyectos prácticos",
    price: 300,
    professorName: "Juan Rodriguez",
    category: "Tecnología",
    grade: "Profesional",
    rating: 4.9,
  },
  {
    className: "Historia",
    description:
      "Enseño historia de una manera interactiva y dinámica para que el alumno se interese por el pasado",
    price: 180,
    professorName: "Carlos Perez",
    category: "Humanidades",
    grade: "Secundaria",
    rating: 3.8,
  },
  {
    className: "Ingles",
    description:
      "Clases de inglés con enfoque en conversación y comprensión auditiva para mejorar la fluidez del alumno",
    price: 220,
    professorName: "Ana Gonzalez",
    category: "Idiomas",
    grade: "Secundaria",
    rating: 4.7,
  },
  {
    className: "Programación",
    description:
      "Curso de programación desde cero, abarcando los conceptos básicos hasta avanzados con proyectos prácticos",
    price: 300,
    professorName: "Juan Rodriguez",
    category: "Tecnología",
    grade: "Profesional",
    rating: 4.9,
  },
];

const description =
  "Ofrezco material al alumno para que aprenda de una manera eficiente y podamos tener un buen vinculo alumno maestro";

const categorias = [
  "Matematicas",
  "Fisica",
  "Quimica",
  "Biologia",
  "Historia",
  "Geografia",
  "Español",
];

const grados = ["Primaria", "Secundaria", "Preparatoria", "Profesional"];

type Course = {
  name: string;
  description: string;
  price: number;
  professorName: string;
};

export default function Explorar() {
  const [openModal, setOpenModal] = useState(false);

  const [modalClassName, setModalClassName] = useState("Matematicas");
  const [modalDescription, setModalDescription] = useState(description);
  const [modalProfessorName, setModalProfessorName] =
    useState("Emilio Dominguez");
  const [modalPrice, setModalPrice] = useState(200);

  const [categories, setCategories] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);

  useEffect(() => {
    setCategories(categorias);
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

  const onClickMoreInfo = ({
    name,
    description,
    price,
    professorName,
  }: Course) => {
    setModalClassName(name);
    setModalDescription(description);
    setModalPrice(price);
    setModalProfessorName(professorName);
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
        {arrayTest
        .filter((course) => 
          (filteredCategory.length === 0 || filteredCategory.includes(course.category)) &&
          (filteredGrade.length === 0 || filteredGrade.includes(course.grade))
        )
        .map((course, index) => (
          <TeacherPayCard
            key={index}
            name={course.className}
            image="aaa.jpg"
            rating={course.rating}
            description={course.description}
            category={course.category}
            grade={course.grade}
            price={course.price}
            professorName={course.professorName}
            toggleModal={onClickMoreInfo}
          />
        ))}
      </div>
      {openModal && (
        <ModalExplorarProfesor
          name={modalClassName}
          description={modalDescription}
          price={modalPrice}
          professorName={modalProfessorName}
          toggleModal={toggleModalHandler}
        />
      )}
    </div>
  );
}
