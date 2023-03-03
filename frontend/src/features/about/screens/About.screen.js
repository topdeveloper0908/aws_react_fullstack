import React from "react";
import { Link } from "react-router-dom";
import styles from "./about.module.css";
import { ContentBox } from "../../profiles/components/content-box/ContentBox.component";

export const AboutScreen = () => {
  return (
    <div className={styles.screenContainer}>
      <div className={styles.hero}></div>
      <div className={styles.greetingContainer}>
        <h1>Join Us!</h1>
        <p>
          We strive to help artists and musicians grow in their field and market
          themselves to expand their reach within the local, national and
          international marketplaces.
        </p>
        <a href="#learnMore">Learn More</a>
      </div>
      <div className={styles.learnMoreContainer} id="learnMore">
        <ContentBox titlePosition="left" titleText="Musicians">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p className={styles.learnMoreText}>
              Looking to book gigs and spread your music? Join the
              CreativeU.Live Community to talk with venues looking for
              performers.
            </p>
            <Link to={"/register"}>
              <button className={styles.registerButton}>Sign Up</button>
            </Link>
          </div>
        </ContentBox>
        <ContentBox titlePosition="left" titleText="Artists">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <p className={styles.learnMoreText}>
              Talk with businesses looking to hire artists to create artwork for
              display. Create lasting relationships with companies and get
              noticed!
            </p>
            <Link to={"/register"}>
              <button className={styles.registerButton}>Sign Up</button>
            </Link>
          </div>
        </ContentBox>
        <ContentBox titlePosition="left" titleText="Businesses">
          <p className={styles.learnMoreText}>
            Support your local artists and musicians by connecting with them and
            hiring them for your next project or venue.
          </p>
        </ContentBox>
      </div>
      <ContentBox
        titlePosition="right"
        titleText="Venues, Businesses, Resources"
      >
        <p className={styles.learnMoreText}>
          Support your local artists and musicians by connecting with them and
          hiring them for your next project or venue. We'll help you connect
          with artists, send instant offers, find artists in your area, and even
          schedule your events all online. You'll also have access to an
          e-commerce account to see your merchandise and further your brand.
        </p>
      </ContentBox>
    </div>
  );
};
