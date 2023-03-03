import React, { useState } from "react";
import { requestPasswordReset } from "../../../../services/authentication/authentication.service";
import { AuthenticationContext } from "../../../../services/authentication/authentication.context";
import { Link } from "react-router-dom";
import styles from "./forgot-password.module.css";
import Recaptcha from "react-recaptcha";

export const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [succeeded, setSucceeded] = useState(false);

  const [recaptchaPassed, setRecaptchaPassed] = useState(false);

  const verifyCallback = (recaptchaToken) => {
    if (recaptchaToken) {
      setRecaptchaPassed(true);
    }
  };

  return (
    <div className={styles.screen}>
      <form className={styles.passwordResetForm}>
        {!succeeded ? (
          <>
            <h2 className={styles.heading}>Send Password Reset Email</h2>
            <label htmlFor="email" className={styles.text}>
              Email Address
            </label>
            <br />
            <input
              className="textInput"
              type="email"
              value={email}
              onChange={(e) => {
                setError("");
                setEmail(e.target.value);
              }}
            />
            <br />
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "end",
                marginTop: "8px",
              }}
            >
              <Recaptcha
                sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
                theme="dark"
                verifyCallback={verifyCallback}
              />
            </div>
            <br />
            <button
              className={styles.btn}
              onClick={(e) => {
                e.preventDefault();
                if (
                  email.length === 0 ||
                  !email.match(
                    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
                  )
                ) {
                  setError("Please enter a properly formatted email.");
                } else if (!recaptchaPassed) {
                  setError("Please complete the recaptcha.");
                } else {
                  requestPasswordReset(email)
                    .then(() => {
                      setSucceeded(true);
                    })
                    .catch((e) => {
                      setError(e.message);
                    });
                }
              }}
            >
              Request Password Reset
            </button>
            <br />
            <p>{error}</p>
          </>
        ) : (
          <>
            <p className={styles.text}>
              An email was sent to the supplied address if an associated account
              exists.
            </p>
            <Link to="/" className={styles.btn} style={{ textDecoration: "none" }}>
              Home
            </Link>
          </>
        )}
      </form>
    </div>
  );
};
