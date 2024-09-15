'use client';

import { useState, useEffect } from "react";
import ModalClass from "@/components/misclases/ModalClass";
import PostClassModal from "@/components/misclases/PostClassModal";
import StudentClass from "@/components/misclases/StudentClass";
import '@/styles/misclases/misclases.css';

type Nico = {
  class_id: number;
  course_id: number;
  course_name: string;
  course_description: string;
  level: string;
  category_name: string;
  teacher_name: string;
  teacher_region: string;
  teacher_timezone: string;
  teacher_rating: number;
  student_id: number;
  timestamp: string;
  duration: string;
  meeting_id: string;
  path_video: string;
  summary: string;
  pathtopic: string;
};


export default function MisClases() {
  const [openModal, setOpenModal] = useState(false);
  const [openPostModal, setOpenPostModal] = useState(false);

  const [upcomingClasses, setUpcomingClasses] = useState<Nico[]>([]);
  const [pastClasses, setPastClasses] = useState<Nico[]>([]);

  // Pre-class modal states
  const [modalClassName, setModalClassName] = useState("Matemáticas 101");
  const [modalProfessorName, setModalProfessorName] = useState("Carlos Francisco Hernández");
  const [modalFecha, setModalFecha] = useState("Martes - 15:25pm");
  const [modalMeetingId, setModalMeetingId] = useState("");

  // Post-class modal states
  const [postClassVideoUrl, setPostClassVideoUrl] = useState("");
  const [postClassDescription, setPostClassDescription] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const user = localStorage.getItem('user');
        const userId = user ? JSON.parse(user).id : null;

        const response = await fetch(`http://216.238.66.189:5000/getClasses?user_id=${userId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Nico[] = await response.json();
        console.log("clases", data);

        const upcoming = data.filter((clase) => new Date(clase.timestamp) >= new Date());
        const past = data.filter((clase) => new Date(clase.timestamp) < new Date());

        setUpcomingClasses(upcoming);
        setPastClasses(past);
      } catch (error) {
        console.error("There was an error fetching the courses!", error);
      }
    };

    fetchClasses();
  }, []);

  const onClassClick = ({ course_name, level, timestamp, meeting_id }: Nico) => {
    // Pre-class
    setModalClassName(course_name);
    setModalProfessorName(level); // Adjust if professor's name needs to be fetched differently
    setModalFecha(timestamp);
    setModalMeetingId(meeting_id);
    setOpenModal(true);
  };

  const onPastClassClick = ({ course_name, level, timestamp, path_video, summary }: Nico) => {
    // Post-class
    setModalClassName(course_name);
    setModalProfessorName(level); // Adjust if professor's name needs to be fetched differently
    setModalFecha(timestamp);
    setPostClassVideoUrl(path_video);
    setPostClassDescription(summary);
    setOpenPostModal(true);
  };

  const toggleModalHandler = () => {
    setOpenModal(!openModal);
  };

  const togglePostModalHandler = () => {
    setOpenPostModal(!openPostModal);
  };

  return (
    <div className="myclasses-container">
      <div className="myclasses-left">
        {/* Próximas Clases */}
        <div className="myclasses-left-container-next-class">
          <p className="myclasses-header">Próximas Clases</p>
          {upcomingClasses.map((cls) => (
            <StudentClass
              key={cls.class_id}
              name={cls.course_name}
              professor={cls.teacher_name} // Now using teacher's name
              date={cls.timestamp}
              meetingId={cls.meeting_id}
              toggleModal={() => onClassClick(cls)}
            />
          
          ))}
          {openModal && (
            <ModalClass
              toggleModal={toggleModalHandler}
              meetingId={modalMeetingId}
              nombre={modalClassName}
              professor={modalProfessorName}
              date={modalFecha}
            />
          )}
        </div>

        {/* Clases Pasadas */}
        <div className="myclasses-left-container-previous-class">
          <p className="myclasses-header">Clases Pasadas</p>
          {pastClasses.map((cls) => (
            <StudentClass
            key={cls.class_id}
            name={cls.course_name}
            professor={cls.teacher_name} // Now using teacher's name
            date={cls.timestamp}
            meetingId={cls.meeting_id}
            toggleModal={() => onClassClick(cls)}
          />
          ))}
          {openPostModal && (
            <PostClassModal
              toggleModal={togglePostModalHandler}
              videoUrl={postClassVideoUrl}
              nombre={modalClassName}
              professor={modalProfessorName}
              date={modalFecha}
              description={postClassDescription}
            />
          )}
        </div>
      </div>
    </div>
  );
}
