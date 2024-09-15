import { useState, useEffect } from 'react';
import { Modal } from "../Modal";
import '@/styles/misclases/PostClassModal.css';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

type PostClassModalProps = {
    toggleModal: Function;
    classId: number | null;
    videoUrl: string;
    nombre: string;
    professor: string;
    date: string;
    description: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://216.238.66.189:5000';

const PostClassModal = ({
    classId,
    nombre,
    professor,
    date,
    videoUrl,
    description,
    toggleModal
}: PostClassModalProps) => {
    const [fetchedSummary, setFetchedSummary] = useState<string>(description);
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null); // Store the video blob for downloading

    // Fetch video and summary when the modal opens
    useEffect(() => {
        if (classId) {
            const fetchVideoAndSummary = async () => {
                try {
                    console.log(`Fetching video for class_id: ${classId}`);
                    // Fetch the video
                    const videoResponse = await fetch(`${apiUrl}/getVideo?class_id=${classId}`);

                    if (!videoResponse.ok) {
                        throw new Error('Failed to fetch video');
                    }

                    const videoBlob = await videoResponse.blob();
                    console.log('Video blob received:', videoBlob);
                    setVideoBlob(videoBlob); // Save the blob for downloading

                    // Fetch the summary
                    console.log(`Fetching summary for class_id: ${classId}`);
                    const summaryResponse = await fetch(`${apiUrl}/getSummary?class_id=${classId}`);

                    if (!summaryResponse.ok) {
                        throw new Error('Failed to fetch summary');
                    }

                    const summaryData = await summaryResponse.json();
                    const summary = summaryData.summary || 'No summary available';
                    console.log('Summary received:', summary);
                    setFetchedSummary(summary);

                } catch (error) {
                    console.error('Error fetching video and summary:', error);
                    toast.error('Failed to load video and summary');
                }
            };

            fetchVideoAndSummary();
        }
    }, [classId]);

    const handleDownload = () => {
        if (videoBlob) {
            const downloadUrl = URL.createObjectURL(videoBlob);
            const a = document.createElement('a');
            a.href = downloadUrl;
            a.download = 'video.webm'; // You can change the filename as needed
            a.click();
            URL.revokeObjectURL(downloadUrl); // Clean up the URL object
        } else {
            toast.error('Video not available for download');
        }
    };

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
                <div className="modal-class-post-download">
                    <button onClick={handleDownload} className="download-button">
                        Download Video
                    </button>
                </div>
                <div className="modal-class-post-description">
                    <ReactMarkdown>{fetchedSummary}</ReactMarkdown>
                </div>
            </div>
        </Modal>
    );
};

export default PostClassModal;
