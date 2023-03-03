import React from "react";
import styles from "./toast.module.css";

export const Toast = ({ code }) => {
  return (
    <div
      className={styles.toast}
      style={{ backgroundColor: code === 2 ? "#2e2e2e" : "#a54d54" }}
    >
      {code === 1
        ? "☣️ WARNING! We have detected malware in the file you've attempted to upload."
        : "⚠️ There was a problem scanning the file for viruses prior to upload. Please try again later."}
    </div>
  );
};
