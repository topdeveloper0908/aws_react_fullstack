import React from "react";
import { Link } from "react-router-dom";
import { Hero } from "../components/Hero";
import { Footer } from "../../../components/footer/Footer.component";
import creativeU from "../../../assets/videos/CreativeU.mp4";
import twoPeopleAtComputer from "../../../../src/assets/images/two-people-at-computer.jpg";
import aGuyWithAGuitar from "../../../../src/assets/images/a-guy-with-guitar.jpg";
import dancer from "../../../assets/images/dancer.jpg";
import saxophonist from "../../../assets/images/saxophonist.jpg";
import artist from "../../../assets/images/artist.jpg";
import recordingStudio from "../../../assets/images/recording-studio.jpg";
import styles from "./home.module.css";

export const HomeScreen = () => {
  return (
    <div className={styles.homeScreen}>
      <Hero />
      <section className={styles.section}>
        <div className={styles.textContainer}>
          <h1 className={styles.heading}>What We Do</h1>
          <img
            src={twoPeopleAtComputer}
            className={styles.headingImage}
            alt="two people at a computer"
            id="what-we-do"
          />
        </div>
        <div className={styles.textContainer}>
          <h2 className={styles.heading}>
            We provide a platform for creatives to connect with businesses and
            resources to grow their brand.
          </h2>
          <p className={styles.text}>
            Users can create a customized profile page including media, events,
            external links, and more. Users can find each other based on
            category, tags and geography, create booking requests, and more.
          </p>
          <p className={styles.text}>
            Looking for creatives to hire for your record label, talent agency,
            gallery, or other business? Just type "discover me" in the search
            bar!
          </p>
        </div>
      </section>
      <section className={styles.section}>
        <div className={styles.textContainer}>
          <h2 className={styles.heading}>Our Users Have Talent</h2>
          <p className={styles.text}>
            Our application is designed for users with skills from acrobatics to
            music, juggling to sculpture. If you are a creative, you can find
            community here.
          </p>
          <p className={styles.text}>
            Are you a business in need of talent or a resource looking to get
            the word out? We've got you covered.
          </p>
        </div>
        <div className={styles.textContainer}>
          <img
            src={aGuyWithAGuitar}
            className={styles.headingImage}
            alt="a man with a guitar"
            id="our-users"
          />
        </div>
      </section>
      <section className={styles.section} id="plans-and-pricing">
        <div className={styles.verticalContainer}>
          <h1 className={styles.heading}>Plans & Pricing</h1>
          <h3 className={styles.text} style={{ textAlign: "center" }}>
            All plans include unlimited access to the full set of features,
            including media uploads, booking requests, and event scheduling.{" "}
            <Link
              className={styles.text}
              to="/register"
              style={{ color: "yellow" }}
            >
              Register today!
            </Link>
          </h3>
          <div className={styles.horizontalContainer}>
            <div className={styles.planCard}>
              <div
                className={styles.planCardImageContainer}
                style={{
                  backgroundImage: `url(${artist})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              <h1>Monthly</h1>
              <h3>- $30 / month, plus tax</h3>
              <h3>- Begin to grow your brand</h3>
              <h3>- Unlimited connections await</h3>
            </div>
            <div className={styles.planCard}>
              <div
                className={styles.planCardImageContainer}
                style={{
                  backgroundImage: `url(${dancer})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              <h1>Yearly</h1>
              <h3>- $250 / year, plus tax</h3>
              <h3>- Best for sustainably expanding your brand</h3>
            </div>
            <div className={styles.planCard}>
              <div
                className={styles.planCardImageContainer}
                style={{
                  backgroundImage: `url(${saxophonist})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
              <h1>Lifetime</h1>
              <h3>- $1500 one-time fee, plus tax</h3>
              <h3>- Most cost-effective plan</h3>
              <h3>- Best for established businesses & creatives</h3>
            </div>
          </div>
          <div className={`${styles.verticalContainer} ${styles.mobilePrices}`}>
            <h3 className={styles.text}>
              Monthly Membership - $30 / month, plus tax
            </h3>
            <h3 className={styles.text}>
              Yearly Membership - $250 / year, plus tax
            </h3>
            <h3 className={styles.text}>
              Lifetime Membership - $1500 one-time, plus tax
            </h3>
          </div>
          <div className={styles.responsiveContainer}>
            <div className={styles.textContainer}>
              <h1 className={styles.heading}>Artist Pack</h1>
              <img
                src={recordingStudio}
                className={styles.headingImage}
                alt="microphone in a recording studio"
              />
            </div>

            <div className={styles.textContainer}>
              <h2 className={styles.heading}>
                Looking to maximize the impact of your membership? Sign up for
                the artist pack! *
              </h2>
              <p className={styles.text}>
                $300 (plus tax) for three months membership, plus an hour of
                recording and mixing, and an hour of video. Select a plan
                (monthly, yearly, or lifetime) after the first three months.
              </p>
              <p className={styles.text}>
                Easily create an EPK using your profile page and sharing your
                link!
              </p>
              <p className={styles.text}>*Available for US-based users only.</p>
            </div>
          </div>
        </div>
      </section>
      <section
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2 className={styles.heading}>Learn More</h2>
        <video
          controls
          style={{
            width: "90%",
            maxWidth: "800px",
            borderRadius: "4px",
            boxShadow: "2px 2px 4px black",
          }}
        >
        
          <source src={creativeU} type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
      </section>
      <br /><br />
      <Footer />
    </div>
  );
};
