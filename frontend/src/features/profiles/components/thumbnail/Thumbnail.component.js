import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./thumbnail.module.css";

export const Thumbnail = ({ url, title, editable, deleteImg }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${url})`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          height: "100px",
          width: "100px",
          minWidth: "100px",
          minHeight: "100px",
          position: "relative",
        }}
        className={styles.thumbnail}
        onClick={(e) => {
          if (e.target.id !== `delete-${url}`) {
            setShowModal(true);
          }
        }}
      >
        {editable && (
          <button
            id={`delete-${url}`}
            className={styles.deleteBtn}
            onClick={() => {
              deleteImg(url, "visual");
            }}
          >
            <FontAwesomeIcon icon={faTimes} size="1x" />
          </button>
        )}
      </div>
      {showModal && (
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
              src={url}
              alt={"user uploaded file"}
              className={styles.expandedImage}
            />
            <h3>{title}</h3>
          </div>
        </div>
      )}
    </>
  );
};
