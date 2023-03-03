import React, { useState, useContext, useEffect } from "react";
import { Footer } from "../../components/footer/Footer.component";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import styles from "./mod-login.module.css";

export const ModLoginScreen = () => {
  const { onLoginMod, error } = useContext(AuthenticationContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  return (
    <>
      <div className={styles.loginScreenContainer} id="login-form">
        <form className={styles.loginForm}>
          <h1 className={styles.heading}>Moderator Login</h1>
          <div className="formRow">
            <div className="labelInputGroup">
              <label htmlFor="email">Email</label>
              <br />
              <input
                className={styles.textInput}
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(event) => {
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
                className={styles.textInput}
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                }}
              />
            </div>
          </div>
          <p className={styles.errorMessage}>{error || validationError}</p>
          <div className={styles.btnContainer}>
            <button
              className={`btn ${styles.loginButton}`}
              onClick={(event) => {
                event.preventDefault();
                let checksPassed = true;
                if (!email.length > 0) {
                  const emailInput = document.getElementById("email");
                  emailInput.classList.add(styles.required);
                  setValidationError("Please complete the required fields.");
                  checksPassed = false;
                }
                if (!password.length > 0) {
                  const passwordInput = document.getElementById("password");
                  passwordInput.classList.add(styles.required);
                  setValidationError("Please complete the required fields.");
                  checksPassed = false;
                }
                if (!checksPassed) return;
                else {
                  onLoginMod(email, password);
                }
              }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};
