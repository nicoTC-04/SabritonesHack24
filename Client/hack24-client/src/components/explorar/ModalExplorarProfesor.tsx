"use client";

import { useState } from "react";
import { Modal } from "../Modal";
import { IoIosCheckmarkCircle } from "react-icons/io";
import "@/styles/Explorar/ModalExplorarProfesor.css";

type ModalExplorarProfesorProps = {
  name: string;
  description: string;
  price: number;
  toggleModal: Function;
  professorName: string;
};

const ModalExplorarProfesor = ({
  name,
  description,
  price,
  toggleModal,
  professorName,
}: ModalExplorarProfesorProps) => {
  const imageModalProfesorErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  };

  const CHECKMARK_ICON_SIZE = 100;
  const [openSubmitted, setOpenSubmitted] = useState(false);

  const onClickRegistrar = () => {
    setOpenSubmitted(true);
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
              <p className="modal-explorar-clase-name">{name}</p>
            </div>
            <div>
              <p className="modal-explorar-clase-description-label">
                Descripcion
              </p>
              <p className="modal-explorar-clase-description">{description}</p>
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
                Prof. {professorName}
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
      {openSubmitted && (
        <Modal width={25} height={30} modalToggle={toggleModal}>
          <div className="modal-registered-main-container">
            <div className="modal-registered-container">
              <IoIosCheckmarkCircle
                className="modal-registered-icon"
                size={CHECKMARK_ICON_SIZE}
              />
              <p className="modal-registered-text">
                Has sido correctamente registrado
              </p>
            </div>
            <button className="modal-registered-close" onClick={onClickCerrar}>
              Cerrar
            </button>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default ModalExplorarProfesor;
