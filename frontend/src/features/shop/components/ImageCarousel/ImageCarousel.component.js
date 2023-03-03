import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./image-carousel.module.css";

export const ImageCarousel = ({ imgUrls, productName }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalCurrentImage, setModalCurrentImage] = useState(0);

  return (
    <>
      <div className={styles.slideshowOuterContainer}>
        <div className={styles.slideshow}>
          {imgUrls.map((url, index) => {
            return (
              <div
                className={`${styles.slide} ${
                  currentImage === index
                    ? styles.slideActive
                    : styles.slideHidden
                }`}
                key={`image-${index}`}
              >
                <img
                  src={url}
                  className={styles.slideshowImage}
                  alt={productName}
                  onClick={() => {
                    setModalCurrentImage(currentImage);
                    setShowModal(true);
                  }}
                />
              </div>
            );
          })}

          <button
            className={styles.previous}
            onClick={() => {
              let previousImage = currentImage - 1;
              if (previousImage < 0) {
                previousImage = imgUrls.length - 1;
              }
              setCurrentImage(previousImage);
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} size="2x" color="white" />
          </button>
          <button
            className={styles.next}
            onClick={() => {
              let nextImage = currentImage + 1;
              if (nextImage >= imgUrls.length) {
                nextImage = 0;
              }
              setCurrentImage(nextImage);
            }}
          >
            <FontAwesomeIcon icon={faAngleRight} size="2x" color="white" />
          </button>
        </div>
        <div className={styles.thumbnailsContainer}>
          {imgUrls.map((url, index) => {
            return (
              <img
                src={url}
                className={`${styles.thumbnail} ${
                  currentImage === index && styles.thumbnailSelected
                }`}
                alt={productName}
                key={`thumbnail-${index}`}
                onClick={() => {
                  setCurrentImage(index);
                }}
              />
            );
          })}
        </div>
      </div>
      <div
        className={styles.expandedImageModalContainer}
        style={{ display: showModal ? "flex" : "none" }}
        onClick={(event) => {
          if (
            event.target.id !== "expandedImageModal" &&
            event.target.parentNode.id !== "expandedImageModal" &&
            event.target.parentNode.parentNode.id !== "expandedImageModal" &&
            event.target.parentNode.parentNode.parentNode.id !==
              "expandedImageModal"
          ) {
            setShowModal(false);
          }
        }}
      >
        <div className={styles.expandedImageModal} id="expandedImageModal">
          <button
            className={styles.closeBtn}
            onClick={() => {
              setShowModal(false);
            }}
          >
            <FontAwesomeIcon icon={faTimes} size="2x" color="white" />
          </button>
          <img
            src={imgUrls[modalCurrentImage]}
            alt={productName}
            className={styles.expandedImage}
          />
          <button
            className={styles.previous}
            onClick={() => {
              let previousImage = modalCurrentImage - 1;
              if (previousImage < 0) {
                previousImage = imgUrls.length - 1;
              }
              setModalCurrentImage(previousImage);
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} size="2x" color="white" />
          </button>
          <button
            className={styles.next}
            onClick={() => {
              let nextImage = modalCurrentImage + 1;
              if (nextImage >= imgUrls.length) {
                nextImage = 0;
              }
              setModalCurrentImage(nextImage);
            }}
          >
            <FontAwesomeIcon icon={faAngleRight} size="2x" color="white" />
          </button>
        </div>
      </div>
    </>
  );
};
