"use client";

import "@/styles/explorar/TeacherPayCard.css";
import StarRatingDisplay from "../landing/StarRatingDisplay";

const TeacherPayCard = () => {
  const imagePayErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  };

  return (
    <div className="teacher-pay-main-container">
      <div className="teacher-pay-image-container">
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
          className="teacher-pay-image"
          onError={imagePayErrorHandler}
        />
      </div>
      <div className="teacher-pay-details-container">
        <div className="teacher-pay-info-container">
          <div className="teacher-pay-basic-container">
            <div className="teacher-pay-name-container">
              <div className="teacher-pay-name-name-container">
                <p className="teacher-pay-name">Emilio Dominguez</p>
              </div>
              <div className="teacher-pay-rating">
                <StarRatingDisplay rating={4.5} />
                <p className="teacher-pay-score">4.5</p>
              </div>
            </div>
            <div className="teacher-pay-description-container">
              <p className="teacher-pay-description">
                Ofrezco material al alumno para que aprenda de una manera
                eficiente y podamos tener un buen vinculo alumno maestro.
              </p>
            </div>
          </div>
          <div className="teacher-pay-cat-grad-container">
            <div className="teacher-pay-details-text-container">
              <p className="teacher-pay-details-text-label">Categoria:</p>
              <p className="teacher-pay-details-text-value">Matematicas</p>
            </div>
            <div className="teacher-pay-details-text-container">
              <p className="teacher-pay-details-text-label">Grado:</p>
              <p className="teacher-pay-details-text-value">Profesional</p>
            </div>
          </div>
        </div>
        <div className="teacher-pay-order-container">
          <div className="teacher-pay-button-container">
            <button className="teacher-pay-button">
              Mas sobre el profesor
            </button>
          </div>
          <div className="teacher-pay-price-container">
            <p className="teacher-pay-price">$200/hr</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPayCard;
