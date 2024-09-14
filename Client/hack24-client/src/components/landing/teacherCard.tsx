"use client";

import "@/styles/landing/teacherCard.css";
import StarRatingDisplay from "./StarRatingDisplay";

type TeacherCardProps = {
  teacher: {
    name: string;
    image: string;
    category: string;
    grade: string;
    score: number;
  };
};

const TeacherCard = ({ teacher }: TeacherCardProps) => {
  const imageTeacherErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  };

  return (
    <div className="teacher-card-main-container">
      <div className="teacher-card-image-container">
        <img
          src={teacher.image}
          className="teacher-card-image"
          onError={imageTeacherErrorHandler}
        />
      </div>
      <div className="teacher-card-description-container">
        <div className="teacher-card-name-stars-container">
          <p className="teacher-card-name">{teacher.name}</p>
          <div>
            <StarRatingDisplay rating={teacher.score} />
          </div>
        </div>
        <div className="teacher-card-teacher-details-container">
          <div className="teacher-card-details-container">
            <div className="teacher-card-details-text-container">
              <p className="teacher-card-details-text-label">Categoria:</p>
              <p className="teacher-card-details-text-value">
                {teacher.category}
              </p>
            </div>
            <div className="teacher-card-details-text-container">
              <p className="teacher-card-details-text-label">Grado:</p>
              <p className="teacher-card-details-text-value">{teacher.grade}</p>
            </div>
          </div>
          <div className="teacher-card-score-container">
            <p>{teacher.score}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherCard;
