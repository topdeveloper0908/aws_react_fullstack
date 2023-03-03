import React, { useState } from "react";
import axios from "axios";
import { Footer } from "../../components/footer/Footer.component";
import styles from "./contact-us.module.css";
import Recaptcha from "react-recaptcha";
import { brotliDecompress } from "zlib";

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [subitting, setSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [recaptchaPassed, setRecaptchaPassed] = useState(false);

  const verifyCallback = (recaptchaToken) => {
    if (recaptchaToken) {
      setRecaptchaPassed(true);
    }
  };

  return (
    <>
      <form
        className={styles.contactUsForm}
        id="contact-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (
            !formData.name.length > 0 ||
            !formData.email.length > 0 ||
            !formData.message.length > 0
          ) {
            setError("Please complete all of the fields.");
            return;
          }
          if (!recaptchaPassed) {
            setError("Please complete the recaptcha.");
            return;
          }
          setSubmitting(true);
          axios
            .post("/contact-us", { ...formData })
            .then(() => {
              setSubmitting(false);
              setFormSubmitted(true);
            })
            .catch((e) => {
              setSubmitting(false);
              setError("Problem submitting the form.");
            });
        }}
      >
        <h2>Contact Us</h2>
        {!formSubmitted ? (
          <>
            <div>
              <label htmlFor="name">
                Your Name{" "}
                <small>
                  <i style={{ color: "#5e5e5e" }}>
                    ({100 - formData.name.length} characters remaining)
                  </i>
                </small>
              </label>
              <br />
              <input
                name="Name"
                id="name"
                type="text"
                className={styles.input}
                value={formData.name}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    setFormData({ ...formData, name: e.target.value });
                  }
                }}
              />
            </div>
            <div>
              <label htmlFor="email">
                Your Email{" "}
                <small>
                  <i style={{ color: "#5e5e5e" }}>
                    ({100 - formData.email.length} characters remaining)
                  </i>
                </small>
              </label>
              <br />
              <input
                name="Email"
                id="email"
                type="email"
                className={styles.input}
                value={formData.email}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    setFormData({ ...formData, email: e.target.value });
                  }
                }}
              />
            </div>
            <div>
              <div>
                <label htmlFor="Message">
                  Message{" "}
                  <small>
                    <i style={{ color: "#5e5e5e" }}>
                      ({1000 - formData.message.length} characters remaining)
                    </i>
                  </small>
                </label>
                <br />
                <textarea
                  id="Message"
                  name="Message"
                  className={styles.textarea}
                  value={formData.message}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      setFormData({ ...formData, message: e.target.value });
                    }
                  }}
                />
              </div>
            </div>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "8px",
              }}
            >
              <Recaptcha
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                theme="light"
                verifyCallback={verifyCallback}
              />
            </div>
            <div>
              <p className={styles.errorMessage}>{error}</p>
              <div style={{ display: "flex", justifyContent: "center"}}>
                <input type="submit" className={styles.btn} />
              </div>
            </div>
          </>
        ) : (
          <h2 style={{ fontFamily: "Noto Sans Display" }}>
            Thank you for your inquiry. We will get back to you soon!
          </h2>
        )}
        <hr style={{ width: "300px" }} />
        <p>
          <a href="mailto:info@creativeu.live" style={{ color: "gray" }}>
            info@creativeu.live
          </a>{" "}
          |{" "}
          <a href="tel:1-844-4ARTS-4U" style={{ color: "gray" }}>
            1-844-4ARTS-4U
          </a>
        </p>
        <p>PO Box 656, Balboa, CA 92661</p>
        <p>
          Have a suggestion? Email us at{" "}
          <a
            style={{ color: "gray" }}
            href="mailto:suggestions@creativeu.live"
          >
            suggestions@creativeu.live
          </a>
        </p>
      </form>
      <Footer />
    </>
  );
};
