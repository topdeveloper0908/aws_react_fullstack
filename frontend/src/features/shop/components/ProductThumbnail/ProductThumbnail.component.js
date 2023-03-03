import React from "react";
import ReactStars from "react-rating-stars-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
import { faStarHalf } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export const ProductThumbnail = ({ product }) => {
  console.log(product.photoUrls[0]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        color: "white",
        marginLeft: "40px",
        marginRight: "40px",
      }}
    >
      <div
        style={{
          backgroundImage: `url("${product.photoUrls[0]}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          minHeight: "200px",
          minWidth: "200px",
          width: "100px",
          height: "100px",
        }}
      ></div>
      <h3 style={{ margin: "4px" }}>{product.name}</h3>
      <div>
        {(() => {
          let returnArr = [];
          let i = 1;
          for (i; i <= product.averageRating; i++) {
            returnArr.push(<FontAwesomeIcon icon={faStar} color="#ffd700" />);
          }
          console.log(i);
          if (product.averageRating - (i - 1) === 0.5) {
            returnArr.push(
              <FontAwesomeIcon icon={faStarHalf} color="#ffd700" />
            );
          }
          return returnArr;
        })()}
      </div>
      <p style={{ margin: "4px" }}>${product.price}</p>
    </div>
  );
};
