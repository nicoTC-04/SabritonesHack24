import { Modal } from "../Modal";
import '@/styles/misclases/PostClassModal.css';

type PostClassModalProps = {
    toggleModal: Function;
    videoUrl: string;
    nombre: string;
    professor: string;
    date: string;
    description: string;
};

const PostClassModal = ({
    nombre, 
    professor, 
    date, 
    videoUrl, 
    description, 
    toggleModal 
}: PostClassModalProps) => {
    const imageModalProfesorErrorHandler = (
        event: React.SyntheticEvent<HTMLImageElement>
    ) => {
        event.currentTarget.src =
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    };

    return (
        <Modal width={45} height={70} modalToggle={toggleModal}>
            <div>
                <div className="modal-class-post-general-container">
                    <div className="modal-class-post-container">
                        <div className="modal-class-post-title">
                            <p>{nombre}</p>
                        </div>
                        <div className="modal-class-post-professor">
                            <p>{professor}</p>
                        </div>
                        <div className="modal-class-post-fecha">
                            <p>{date}</p>
                        </div>
                    </div>
                    <div className="modal-class-post-image">
                        <img
                            src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                            className="modal-explorar-clase-image"
                            onError={imageModalProfesorErrorHandler}
                        />
                    </div>
                </div>
                <div className="modal-class-post-video">
                    <video controls>
                        <source src={videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="modal-class-post-description">
                    <p>{description}</p>
                </div>
            </div>
        </Modal>
    );
};

export default PostClassModal;
