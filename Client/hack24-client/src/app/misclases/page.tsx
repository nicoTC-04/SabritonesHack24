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
    // Replace with the actual user_id
    const userId = localStorage.getItem('user');

    fetch(`http://216.238.66.189:5000/getClasses?user_id=${userId}`)
      .then(response => response.json())
      .then(data => {
        // Separate upcoming and past classes based on a date comparison
        const upcoming = data.filter((cls: Nico) => /* Your condition for upcoming classes */);
        const past = data.filter((cls: Nico) => /* Your condition for past classes */);

        setUpcomingClasses(upcoming);
        setPastClasses(past);
      })
      .catch(error => console.error('Error fetching classes:', error));
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
          <StudentClass 
            name="Matemáticas 101" 
            professor="Carlos Francisco Hernandez" 
            date="Martes - 15:25pm" 
            meetingId="https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_3x4.jpg" 
            toggleModal={onClassClick} 
          />
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
          <StudentClass 
            name="Historia 201" 
            professor="Juan Perez" 
            date="Lunes - 14:00pm" 
            videoUrl="https://path-to-your-video.mp4" 
            description="Lorem ipsum odor amet, consectetuer adipiscing elit. Purus rutrum condimentum netus torquent morbi; cursus accumsan. Lacinia iaculis efficitur suspendisse elementum potenti? Fusce quis consequat efficitur curabitur tempor amet class gravida sagittis. Augue arcu massa nam etiam; magna a cras. Libero dictum non parturient duis id pharetra adipiscing mi tincidunt. Tincidunt odio scelerisque eu quis fringilla taciti. Est platea sapien consectetur sagittis finibus parturient faucibus. Montes inceptos magna magnis magna tellus pharetra id sodales nunc.

Penatibus sociosqu cras nullam maximus; luctus montes eleifend per. Netus pretium mauris duis; potenti curabitur platea porttitor magnis? Rhoncus hac eget pulvinar adipiscing mattis quis litora. Vulputate blandit semper sit integer dictum, morbi consequat faucibus fames. At conubia vel tincidunt vel elementum parturient. Nullam semper nullam amet integer adipiscing turpis, lacus tellus ultricies. Tincidunt varius phasellus justo urna fusce montes. Phasellus id non integer imperdiet tristique.

Magna maximus eget vitae dictumst porttitor cras nam eget. Diam felis per orci at penatibus enim. Interdum ex vestibulum tincidunt at metus est laoreet eu. Praesent praesent elit interdum taciti mi orci neque. Ipsum imperdiet ullamcorper nascetur primis varius ullamcorper dis lacus. Molestie augue vehicula himenaeos urna donec diam. Potenti condimentum aliquam mus volutpat pulvinar facilisi metus. Quisque augue taciti vivamus et fringilla. Netus efficitur ut ad; elementum massa dis.

Proin aliquam dictum nec ac cursus venenatis. Pretium consequat fusce hendrerit primis nisi, sit nisl primis placerat. Ultrices curabitur adipiscing gravida tempus lacus. Maecenas vehicula congue auctor, lacinia adipiscing vehicula id luctus. Nisi pellentesque non aliquet ornare dictumst varius nullam. Nunc curae malesuada feugiat ornare,." 
            toggleModal={onPastClassClick} 
          />
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