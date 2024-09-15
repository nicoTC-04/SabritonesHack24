"use client";

import TeacherPayCard from "@/components/explorar/TeacherPayCard";
import { useState } from "react";
import ModalExplorarProfesor from "@/components/explorar/ModalExplorarProfesor";

const description = "Ofrezco material al alumno para que aprenda de una manera eficiente y podamos tener un buen vinculo alumno maestro"

export default function Explorar() {
  const [openModal, setOpenModal] = useState(false);

  const toggleModalHandler = () => {
    setOpenModal(!openModal);
  };

  return (
    <div>
      Explorar
      <TeacherPayCard name="Emilio Dominguez" image="aaa.jpg" rating={4.5} description={description} category="Matematicas" grade="Profesional" price={200} toggleModal={toggleModalHandler} />
      {openModal && <ModalExplorarProfesor toggleModal={toggleModalHandler} />}
    </div>
  );
}
