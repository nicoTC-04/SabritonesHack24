'use client'

import "@/styles/landing/RatingCard.css";
import StarRatingDisplay from "./StarRatingDisplay";

type ReviewCardProps = {
  review: {
    name: string;
    score: number;
    review: string;
    image: string;
  };
};

const RatingCard = ({ review }: ReviewCardProps) => {
  const imageRatingErrorHandler = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  };

  return (
    <div className="rating-card-main-container">
      <div className="rating-card-image-main-container">
        <div className="rating-card-image-container">
          <img
            src={review.image}
            className="rating-card-image"
            onError={imageRatingErrorHandler}
          />
        </div>
      </div>
      <div className="rating-card-details-container">
        <div className="rating-card-name-text">
          <p>{review.name}</p>
        </div>
        <div>
          <StarRatingDisplay rating={review.score} />
        </div>
      </div>
      <div className="rating-card-review">
        <p>{review.review}</p>
      </div>
    </div>
  );
};

export default RatingCard;
