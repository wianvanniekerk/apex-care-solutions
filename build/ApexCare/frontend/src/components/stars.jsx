import React, { useState } from "react";
import "../styles.css";

const Rating = () => {
  const [rating, setRating] = useState(0);

  const rate = (index) => {
    setRating(index + 1);
  };

  return (
    <div className="stars">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          id="Star"
          onClick={() => rate(index)}
          className={index < rating ? 'rate' : 'hide'}
        />
      ))}
    </div>
  );
};

export default Rating;
