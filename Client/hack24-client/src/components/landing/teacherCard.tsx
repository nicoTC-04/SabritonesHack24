"use client";

import "@/styles/landing/teacherCard.css";
import StarRatingDisplay from "./StarRatingDisplay";

interface Appointment {
  appointment_id: number;
  appointment_timestamp: string;
  status: string;
}

interface Course {
  appointments: Appointment[];
  course_description: string;
  course_id: number;
  course_name: string;
  level: string;
  pathtopic: string;
  teacher_id: number;
  teacher_name: string;
  teacher_rating: string;
}

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const imageCourseErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  };

  return (
    <div className="teacher-card-main-container">
      <div className="teacher-card-image-container">
        <img
          src={course.pathtopic}
          className="teacher-card-image"
          onError={imageCourseErrorHandler}
        />
      </div>
      <div className="teacher-card-description-container">
        <div className="teacher-card-name-stars-container">
          <p className="teacher-card-name">{course.course_name}</p>
          <div>
            <StarRatingDisplay rating={parseFloat(course.teacher_rating)} />
          </div>
        </div>
        <div className="teacher-card-teacher-details-container">
          <div className="teacher-card-details-container">
            <div className="teacher-card-details-text-container">
              <p className="teacher-card-details-text-label">Nivel:</p>
              <p className="teacher-card-details-text-value">{course.level}</p>
            </div>
            <div className="teacher-card-details-text-container">
              <p className="teacher-card-details-text-label">Profesor:</p>
              <p className="teacher-card-details-text-value">{course.teacher_name}</p>
            </div>
          </div>
          <div className="teacher-card-score-container">
            <p>{course.teacher_rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;