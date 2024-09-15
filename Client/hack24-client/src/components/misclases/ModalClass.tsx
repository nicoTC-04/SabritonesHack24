import { Modal } from "../Modal";
import'@/styles/misclases/ModalClass.css'

type ModalClassProps = {
    toggleModal: Function;
    meetingId: string;
    nombre: string;
    professor: string;
    date: string;
};

const ModalClass = ({
    nombre, 
    professor, 
    date, 
    meetingId, 
    toggleModal 
    }: ModalClassProps) => {
    const imageModalProfesorErrorHandler = (
        event: React.SyntheticEvent<HTMLImageElement>
    ) => {
        event.currentTarget.src =
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    };
    return (
        <Modal width={50} height={55} modalToggle={toggleModal}>
            <div className="modal-class-general-container">
                <div className="modal-class-container">
                    <div className="modal-class-title">
                        <p>{nombre}</p>
                    </div>
                    <div className="modal-class-professor">
                        <p>{professor}</p>
                    </div>
                    <div className="modal-class-fecha">
                        <p>{date}</p>
                    </div>
                    <div className="modal-class-link">
                        <a href={meetingId} className="button">Link a tu clase!</a>
                    </div>
                </div>
                <div className="modal-class-image">
                    <img
                        src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                        className="modal-explorar-clase-image"
                        onError={imageModalProfesorErrorHandler}
                    />
                </div>
            </div>
        </Modal>
    )
}

export default ModalClass