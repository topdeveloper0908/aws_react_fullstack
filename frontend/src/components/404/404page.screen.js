import React from "react";
import styles from "./styles.module.css";

export const Four04Page = () => {
  return (
    <div className={styles.screen}>
      <h1 className={styles.largeText}>404</h1>
      <h2 className={styles.text}>
        Oops! We couldn't find the page you were looking for.
      </h2>
    </div>
  );
};
