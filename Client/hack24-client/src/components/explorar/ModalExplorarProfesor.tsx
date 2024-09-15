import { Modal } from "../Modal";
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
          <button className="modal-explorar-clase-registrar-button">
            Registrar
          </button>
          <p className="modal-explorar-clase-price">${price}/hr</p>
        </div>
      </div>
    </Modal>
  );
};

export default ModalExplorarProfesor;
