'use client'

import { useState, useEffect } from "react"
import ModalClass from "@/components/misclases/ModalClass"
import PostClassModal from "@/components/misclases/PostClassModal"
import StudentClass from "@/components/misclases/StudentClass"
import '@/styles/misclases/misclases.css'

type Nico ={
  name: string;
  professor: string;
  date: string;
  meetingId?: string;
  videoUrl?: string;
  description?: string;
};

export default function MisClases() {
  const[openModal, setOpenModal] = useState(false);
  const[openPostModal, setOpenPostModal] = useState(false);

  const [upcomingClasses, setUpcomingClasses] = useState<Nico[]>([]);
  const [pastClasses, setPastClasses] = useState<Nico[]>([]);

  // Pre-class modal states
  const[modalClassName, setModalClassName] = useState("Matematicas 101");
  const[modalProfessorName, setModalProfessorName] = useState("Carlos Francisco Hernandez");
  const[modalFecha, setModalFecha] = useState("Martes - 15:25pm");
  const[modalMeetingId, setModalMeetingId] = useState("https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg");

  // Post-class modal states
  const[postClassVideoUrl, setPostClassVideoUrl] = useState("");
  const[postClassDescription, setPostClassDescription] = useState("");

  useEffect(() => {
      const fetchClasses = async () => {
        try {
          const user = localStorage.getItem('user');
          const userId = user ? JSON.parse(user).id : null;

          const response = await fetch(`http://216.238.66.189:5000/getClasses?user_id=${userId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          console.log("clases",data);

          const upcoming = data.filter((clase: any) => new Date(clase.date) >= new Date());
          const past = data.filter((clase: any) => new Date(clase.date) < new Date());

          setUpcomingClasses(upcoming);
          setPastClasses(past);
        } catch (error) {
          console.error("There was an error fetching the courses!", error);
        }
      };

      fetchClasses();
  }, []);


  const onClassClick = ({ name, professor, date, meetingId }: Nico) => {
    // Pre-class
    setModalClassName(name);
    setModalProfessorName(professor);
    setModalFecha(date);
    setModalMeetingId(meetingId || "");
    setOpenModal(true);
  };

  const onPastClassClick = ({ name, professor, date, videoUrl, description }: Nico) => {
    // Post-class
    setModalClassName(name);
    setModalProfessorName(professor);
    setModalFecha(date);
    setPostClassVideoUrl(videoUrl || "");
    setPostClassDescription(description || "");
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
              key={cls.name} // You might want to use a more unique key like cls.id
              name={cls.name}
              professor={cls.professor}
              date={cls.date}
              meetingId={cls.meetingId}
              toggleModal={onClassClick}
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
              key={cls.name}
              name={cls.name}
              professor={cls.professor}
              date={cls.date}
              videoUrl={cls.videoUrl}
              description={cls.description}
              toggleModal={onPastClassClick}
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