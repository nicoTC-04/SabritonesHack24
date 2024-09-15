"use client";

import TeacherPayCard from "@/components/explorar/TeacherPayCard";
import { useState } from "react";
import ModalExplorarProfesor from "@/components/explorar/ModalExplorarProfesor";

const description =
  "Ofrezco material al alumno para que aprenda de una manera eficiente y podamos tener un buen vinculo alumno maestro";

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
    <div>
      Explorar
      <TeacherPayCard
        name="Emilio Dominguez"
        image="aaa.jpg"
        rating={4.5}
        description={description}
        category="Matematicas"
        grade="Profesional"
        price={200}
        toggleModal={onClickMoreInfo}
      />
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
