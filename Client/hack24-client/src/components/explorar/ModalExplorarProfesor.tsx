"use client";

import { useState } from "react";
import { Modal } from "../Modal";
import "@/styles/Explorar/ModalExplorarProfesor.css";
import ModalExplorarRegistro from "./ModalExplorarRegistro";

type ModalExplorarProfesorProps = {
  price: number;
  toggleModal: Function;
  datosCurso?: CardFetch;
};

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

const ModalExplorarProfesor = ({
  price,
  toggleModal,
  datosCurso,
}: ModalExplorarProfesorProps) => {
  const imageModalProfesorErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  };

  const [openRegister, setOpenRegister] = useState(false);

  const onClickRegistrar = () => {
    setOpenRegister(true);
  };

  const onClickCerrar = () => {
    toggleModal();
  };

  return (
    <Modal width={60} height={60} modalToggle={toggleModal}>
      <div className="modal-explorar-main-container">
        <div className="modal-explorar-clase-datos-container">
          <div className="modal-explorar-clase-details-container">
            <div className="modal-explorar-clase-basic-info-container">
              <p className="modal-explorar-clase-name">
                {datosCurso?.course_name}
              </p>
            </div>
            <div>
              <p className="modal-explorar-clase-description-label">
                Descripcion
              </p>
              <p className="modal-explorar-clase-description">
                {datosCurso?.course_description}
              </p>
            </div>
          </div>
          <div className="modal-explorar-clase-image-container-container">
            <div className="modal-explorar-clase-image-container">
              <img
                src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                className="modal-explorar-clase-image"
                onError={imageModalProfesorErrorHandler}
              />
              <p className="modal-explorar-clase-professor-name">
                Prof. {datosCurso?.teacher_name}
              </p>
            </div>
          </div>
        </div>
        <div className="modal-explorar-clase-registrar-container">
          <button
            className="modal-explorar-clase-registrar-button"
            onClick={onClickRegistrar}
          >
            Registrar
          </button>
          <p className="modal-explorar-clase-price">${price}/hr</p>
        </div>
      </div>
      {openRegister && (
        <ModalExplorarRegistro
          curso_id={datosCurso?.course_id}
          appointments={datosCurso?.appointments}
          toggleModal={onClickCerrar}
        />
      )}
    </Modal>
  );
};

export default ModalExplorarProfesor;
