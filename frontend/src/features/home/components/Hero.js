import React from "react";
import styles from "./hero.module.css";
import heroImage from "../../../assets/images/hero-original.jpg";

export const Hero = () => {
  return (
    <div
      style={{ backgroundImage: `url(${heroImage})` }}
      className={styles.hero}
      id="hero"
    >
      <div className={styles.brandContainer}>
        <h1 className={styles.brand}>CREATIVEU</h1>
      </div>
      <div className={styles.headingContainer}>
        <h1 className={styles.heading}>You Create It, You Live It.</h1>
      </div>
    </div>
  );
};
