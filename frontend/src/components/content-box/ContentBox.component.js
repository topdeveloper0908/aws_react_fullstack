import React from "react";
import styles from "./content-box.module.css";

export const ContentBox = ({ titlePosition, titleText, children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <h2
          className={`${styles.heading} ${
            titlePosition === "right" ? styles.headingRight : styles.headingLeft
          }`}
        >
          {titleText}
        </h2>
        {children}
      </div>
    </div>
  );
};
