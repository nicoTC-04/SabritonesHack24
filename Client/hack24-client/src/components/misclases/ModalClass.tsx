import { Modal } from "../Modal";
import'@/styles/misclases/ModalClass.css'

type ModalClassProps = {
    toggleModal: Function;
    linkURL: string;
    nombre: string;
    professor: string;
    fecha: string;
    hora: string;
}

const ModalClass = ({ nombre, professor, fecha, hora, linkURL, toggleModal }: ModalClassProps) => {
    return (
        <Modal width={40} height={45} modalToggle={toggleModal}>
            <div className="modal-class-general-container">
                <div className="modal-class-container">
                    <div className="modal-class-title">
                        <p>{nombre}</p>
                    </div>
                    <div className="modal-class-professor">
                        <p>{professor}</p>
                    </div>
                    <div className="modal-class-fecha">
                        <p>{fecha} {hora}</p>
                    </div>
                    <div className="modal-class-link">
                        <a href={linkURL} className="button">Link a tu clase!</a>
                    </div>
                </div>
                <div className="modal-class-image">
                    hi
                </div>
            </div>
        </Modal>
    )
}

export default ModalClass