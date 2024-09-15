"use client";

import "@/styles/explorar/TeacherPayCard.css";
import StarRatingDisplay from "../landing/StarRatingDisplay";

type TeacherPayCardProps = {
    image: string;
    name: string;
    rating: number;
    description: string;
    category: string;
    grade: string;
    price: number;
    toggleModal: Function;
}

const TeacherPayCard = ({image, name, rating, description, category, grade, price, toggleModal}: TeacherPayCardProps) => {
  const imagePayErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  };

  const toggleModalHandler = () => {
    toggleModal();
  }

  return (
    <div className="teacher-pay-main-container">
      <div className="teacher-pay-image-container">
        <img
          src={image}
          className="teacher-pay-image"
          onError={imagePayErrorHandler}
        />
      </div>
      <div className="teacher-pay-details-container">
        <div className="teacher-pay-info-container">
          <div className="teacher-pay-basic-container">
            <div className="teacher-pay-name-container">
              <div className="teacher-pay-name-name-container">
                <p className="teacher-pay-name">{name}</p>
              </div>
              <div className="teacher-pay-rating">
                <StarRatingDisplay rating={rating} />
                <p className="teacher-pay-score">{rating}</p>
              </div>
            </div>
            <div className="teacher-pay-description-container">
              <p className="teacher-pay-description">
                {description}
              </p>
            </div>
          </div>
          <div className="teacher-pay-cat-grad-container">
            <div className="teacher-pay-details-text-container">
              <p className="teacher-pay-details-text-label">Categoria:</p>
              <p className="teacher-pay-details-text-value">{category}</p>
            </div>
            <div className="teacher-pay-details-text-container">
              <p className="teacher-pay-details-text-label">Grado:</p>
              <p className="teacher-pay-details-text-value">{grade}</p>
            </div>
          </div>
        </div>
        <div className="teacher-pay-order-container">
          <div className="teacher-pay-button-container">
            <button className="teacher-pay-button" onClick={toggleModalHandler}>
              Mas sobre el profesor
            </button>
          </div>
          <div className="teacher-pay-price-container">
            <p className="teacher-pay-price">${price}/hr</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPayCard;
