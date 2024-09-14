import "@/styles/landing/StarRatingDisplay.css";
import { IoIosStar } from "react-icons/io";

type StarRatingDisplayProps = {
  rating: number;
};

const StarRatingDisplay = ({ rating }: StarRatingDisplayProps) => {
  return (
    <div className="star-rating-display-main-container">
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index}>
          {index <= Math.round(rating) ? (
            <IoIosStar className="star-rating-display filled" />
          ) : (
            <IoIosStar className="star-rating-display" />
          )}
        </span>
      ))}
    </div>
  );
};

StarRatingDisplay.propTypes = {};

export default StarRatingDisplay;
