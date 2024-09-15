import { Modal } from "../Modal";
import '@/styles/misclases/ModalClass.css';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type ModalClassProps = {
    toggleModal: Function;
    classId: number | null; // Add classId to props
    meetingId: string;
    nombre: string;
    professor: string;
    date: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://216.238.66.189:5000';

const ModalClass = ({
    classId, // Include classId in destructuring
    nombre, 
    professor, 
    date, 
    meetingId, 
    toggleModal 
}: ModalClassProps) => {
    const router = useRouter();

    const imageModalProfesorErrorHandler = (
        event: React.SyntheticEvent<HTMLImageElement>
    ) => {
        event.currentTarget.src =
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    };

    const handleJoinClass = async () => {
        // Retrieve username from localStorage
        const user = localStorage.getItem('user');
        const username = user ? JSON.parse(user).name : '';

        if (!username.trim()) {
            toast.error('Username not found. Please log in first.');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/users/${meetingId}`);
            if (!response.ok) {
                toast.error('Meeting not found. Please try again.');
                return;
            }

            const users: string[] = await response.json();
            if (users.includes(username)) {
                toast.error(`User ${username} is already in this meeting.`);
                return;
            }

            // Navigate to the meeting page
            const url = `/meet/${meetingId}?username=${encodeURIComponent(username)}`;
            window.open(url, '_blank'); // Open in a new tab
        } catch (error) {
            toast.error('Failed to join the meeting. Please try again.');
        }
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
                        <button onClick={handleJoinClass} className="button">Link a tu clase!</button>
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
    );
};

export default ModalClass;
