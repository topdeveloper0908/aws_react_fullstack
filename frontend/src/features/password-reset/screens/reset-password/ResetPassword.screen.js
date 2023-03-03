import React, { useState, useContext } from "react";
import { resetPassword } from "../../../../services/authentication/authentication.service";
import { Link } from "react-router-dom";
import styles from "./reset-password.module.css";

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

export const ResetPasswordScreen = () => {
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [error, setError] = useState("");
  const [succeeded, setSucceeded] = useState(false);

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const resetCode = params.get("resetcode");

  return (
    <div className={styles.screen}>
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
      <p className={styles.errorMessage}>{error}</p>
      <button
        className={"form-control"}
        style={{ width: "100px" }}
        onClick={(event) => {
          event.preventDefault();
          if (validatePassword(password, repeatedPassword, setError)) {
            resetPassword(password, resetCode)
              .then(() => {
                setSucceeded(true);
              })
              .catch((e) => {
                setError(e.message);
              });
          }
        }}
      >
        Reset Password
      </button>
      {succeeded && <p>Succeeded</p>}
      {error && <p>{error}</p>}
    </div>
  );
};
