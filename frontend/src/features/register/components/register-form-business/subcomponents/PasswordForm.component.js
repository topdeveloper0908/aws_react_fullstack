import React, { useState, useContext, useEffect } from "react";
import { AuthenticationContext } from "../../../../../services/authentication/authentication.context";
import Recaptcha from "react-recaptcha";
import styles from "../register-form-business.module.css";
import $scriptjs from "scriptjs";

const validatePassword = (pword, repeatedPword, setErr) => {
  const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$&()`.+,\/"-])/gm;

  if (pword !== repeatedPword) {
    setErr("Please ensure the password and repeated password match.");
    let input = document.getElementById("password");
    input.classList.add(`${styles.required}`);
    input = document.getElementById("repeatedPassword");
    input.classList.add(`${styles.required}`);
    return false;
  }
  if (pword.length < 8) {
    setErr("Please ensure the password is at least 8 characters long.");
    const input = document.getElementById("password");
    input.classList.add(`${styles.required}`);
    return false;
  }
  if (pword.length > 64) {
    const input = document.getElementById("password");
    input.classList.add(`${styles.required}`);
    setErr("Please ensure the password is no longer than 64 characters.");
    return false;
  }
  if (!regex.test(pword)) {
    const input = document.getElementById("password");
    input.classList.add(`${styles.required}`);
    setErr(
      "Please ensure that the password contains at least one uppercase letter, one lowercase letter, one number and one symbol."
    );
    return false;
  }
  setErr("");
  return true;
};

export const PasswordForm = ({ parentFormData, setParentPage }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { onRegister } = useContext(AuthenticationContext);

  const [password, setPassword] = useState(parentFormData.current.password);
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [recaptchaPassed, setRecaptchaPassed] = useState(false);
  const [error, setError] = useState("");

  const verifyCallback = (recaptchaToken) => {
    if (recaptchaToken) {
      setRecaptchaPassed(true);
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ marginLeft: "12px" }}>
        <small style={{ fontStyle: "italic" }}>
          Password must be between 8 and 64 characters long, and contain at
          least one capital letter, lowercase letter, number and special
          character.
        </small>
      </div>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="password">Password*</label>
          <br />
          <input
            className="textInput"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(event) => {
              parentFormData.current = {
                ...parentFormData.current,
                password: event.target.value,
              };
              setPassword(event.target.value);
            }}
          />
        </div>
      </div>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="repeatedPassword">Re-enter Password*</label>
          <br />
          <input
            className="textInput"
            type="password"
            id="repeatedPassword"
            name="password"
            value={repeatedPassword}
            onChange={(event) => {
              setRepeatedPassword(event.target.value);
            }}
          />
        </div>
      </div>
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
      <p className={styles.errorMessage}>{error}</p>
      <p>
      <div style={{ display: "flex" }}>
        <button
          className="form-control"
          style={{ width: "100px" }}
          onClick={(event) => {
            event.preventDefault();
            setParentPage("address-info");
          }}
        >
          Back
        </button>
        <button
          className="form-control"
          style={{ width: "100px" }}
          onClick={(event) => {
            event.preventDefault();
            if (validatePassword(password, repeatedPassword, setError)) {
              if (!recaptchaPassed) {
                setError("Please complete the recaptcha");
                return;
              } else {
                onRegister(parentFormData.current);
              }
            }
          }}
        >
          Register
        </button>
        </div>
      </p>
    </div>
  );
};
