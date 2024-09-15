import { useState, useEffect } from 'react';
import { Modal } from "../Modal";
import '@/styles/misclases/PostClassModal.css';
import toast from 'react-hot-toast';

type PostClassModalProps = {
    toggleModal: Function;
    classId: number | null; // Add classId to props
    videoUrl: string;
    nombre: string;
    professor: string;
    date: string;
    description: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://216.238.66.189:5000';

const PostClassModal = ({
    classId, // Include classId in destructuring
    nombre, 
    professor, 
    date, 
    videoUrl, 
    description, 
    toggleModal 
}: PostClassModalProps) => {
    const [fetchedVideoUrl, setFetchedVideoUrl] = useState<string>(videoUrl);
    const [fetchedSummary, setFetchedSummary] = useState<string>(description);

    // Fetch video and summary when the modal opens
    useEffect(() => {
        if (classId) {
            const fetchVideoAndSummary = async () => {
                try {
                    // Fetch the video
                    const videoResponse = await fetch(`${apiUrl}/getVideo?class_id=${classId}`);
                    
                    if (!videoResponse.ok) {
                        throw new Error('Failed to fetch video');
                    }

                    const videoBlob = await videoResponse.blob();
                    const videoUrl = URL.createObjectURL(videoBlob);
                    setFetchedVideoUrl(videoUrl);

                    // Fetch the summary
                    const summaryResponse = await fetch(`${apiUrl}/getSummary?class_id=${classId}`);

                    if (!summaryResponse.ok) {
                        throw new Error('Failed to fetch summary');
                    }

                    const summaryData = await summaryResponse.json();
                    const summary = summaryData.summary || 'No summary available';
                    setFetchedSummary(summary);

                } catch (error) {
                    console.error('Error fetching video and summary:', error);
                    toast.error('Failed to load video and summary');
                }
            };

            fetchVideoAndSummary();
        }
    }, [classId]);

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
                        <source src={fetchedVideoUrl} type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="modal-class-post-description">
                    <p>{fetchedSummary}</p>
                </div>
            </div>
        </Modal>
    );
};

export default PostClassModal;
