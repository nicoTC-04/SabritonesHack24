"use client";

import "@/styles/landing/teacherCard.css";
import StarRatingDisplay from "./StarRatingDisplay";

interface Course {
  appointments: number[];
  course_id: number;
  level: string;
  name: string;
  pathtopic: string;
  rating: string;
  user_id: number;
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
          <p className="teacher-card-name">{course.name}</p>
          <div>
            <StarRatingDisplay rating={parseFloat(course.rating)} />
          </div>
        </div>
        <div className="teacher-card-teacher-details-container">
          <div className="teacher-card-details-container">
            <div className="teacher-card-details-text-container">
              <p className="teacher-card-details-text-label">Nivel:</p>
              <p className="teacher-card-details-text-value">{course.level}</p>
            </div>
            <div className="teacher-card-details-text-container">
              <p className="teacher-card-details-text-label">ID del Curso:</p>
              <p className="teacher-card-details-text-value">{course.course_id}</p>
            </div>
          </div>
          <div className="teacher-card-score-container">
            <p>{course.rating}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;