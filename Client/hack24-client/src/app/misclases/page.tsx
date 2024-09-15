'use client'

import ModalClass from "@/components/misclases/ModalClass"
import { useState } from "react"
import StudentClass from "@/components/misclases/StudentClass"
import '@/styles/misclases/misclases.css'


export default function MisClases() {
  const[openModal, setOpenModal] = useState(false);

  const toggleModalHandler = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="myclasses-container">
      <div className="myclasses-left-container">
        <p className="myclasses-header">Próximas Clases</p>
        <StudentClass name="Matemáticas 101" professor="Carlos Francisco Hernandez" fecha="Martes" hora="15:25pm" toggleModal={toggleModalHandler}/>
        {openModal && <ModalClass toggleModal={toggleModalHandler} linkURL={"https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg"} nombre={"Matemáticas 101"} professor={"Carlos Francisco Hernandez"} fecha={"Martes"} hora={"15:25pm"} /> }
      </div>

    </div>
  )
}