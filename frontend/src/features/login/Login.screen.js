import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../../components/footer/Footer.component";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import ScaleLoader from "react-spinners/ScaleLoader";
import styles from "./login.module.css";
import Recaptcha from "react-recaptcha";

export const LoginScreen = () => {
  const { onLogin, error } = useContext(AuthenticationContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [validationError, setValidationError] = useState("");

  const [recaptchaPassed, setRecaptchaPassed] = useState(true); //DEFAULT TO TRUE FOR TESTING

  const verifyCallback = (recaptchaToken) => {
    if (recaptchaToken) {
      setRecaptchaPassed(true);
    }
  };

  return (
    <>
      <div className={styles.loginScreenContainer} id="login-form">
        <form className={styles.loginForm}>
          <h1 className={styles.heading}>Login</h1>
          <div className="formRow">
            <div className="labelInputGroup">
              <label htmlFor="email">Email</label>
              <br />
              <input
                className="form-control"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(event) => {
                  const emailInput = document.getElementById("email");
                  emailInput.classList.remove(styles.required);
                  if (password.length > 0) {
                    setValidationError("");
                  }
                  setEmail(event.target.value);
                }}
              />
            </div>
          </div>
          <div className="formRow">
            <div className="labelInputGroup">
              <label htmlFor="password">Password</label>
              <br />
              <input
                className="form-control"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => {
                  const passwordInput = document.getElementById("password");
                  passwordInput.classList.remove(styles.required);
                  if (email.length > 0) {
                    setValidationError("");
                  }
                  setPassword(event.target.value);
                }}
              />
            </div>
          </div>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "end",
              marginTop: "30px",
            }}
          >
            <Recaptcha
              sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
              theme="dark"
              verifyCallback={verifyCallback}
            />
          </div>
          <br />
          <div className={styles.btnContainer}>
            <button
              style={{ width: "85px" }}
              className="form-control"
              onClick={(event) => {
                event.preventDefault();
                let checksPassed = true;
                if (!email.length > 0) {
                  const emailInput = document.getElementById("email");
                  emailInput.classList.add(styles.required);
                  setValidationError("Please complete the required fields");
                  checksPassed = false;
                }
                if (!password.length > 0) {
                  const passwordInput = document.getElementById("password");
                  passwordInput.classList.add(styles.required);
                  setValidationError("Please complete the required fields");
                  checksPassed = false;
                }
                if (!checksPassed) return;
                if (!recaptchaPassed) {
                  setValidationError("Please complete the recaptcha.");
                  return;
                } else {
                  onLogin(email, password);
                }
              }}
            >
              Login
            </button>
          </div>
          <p className={styles.errorMessage}>{validationError || error}</p>
          <Link
            to="/forgot-password"
            style={{
              fontFamily: "Noto Sans Display",
              color: "yellow",
              textDecoration: "none",
              fontSize: "16px",
            }}
          >
            forgot password?
          </Link>
        </form>
      </div>
      <Footer />
    </>
  );
};
