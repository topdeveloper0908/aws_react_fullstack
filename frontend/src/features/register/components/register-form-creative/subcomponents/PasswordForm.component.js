import React, { useState, useContext, useEffect } from "react";
import { AuthenticationContext } from "../../../../../services/authentication/authentication.context";
import Recaptcha from "react-recaptcha";
import styles from "../register-form-creative.module.css";
import ScaleLoader from "react-spinners/ScaleLoader";

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
  const [error, setError] = useState("");
  //DEFAULT TO TRUE FOR TESTING
  const [recaptchaPassed, setRecaptchaPassed] = useState(false);
  const [registering, setRegistering] = useState(false);

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
          paddingRight: "10px"
        }}
      >
        <Recaptcha
          sitekey={process.env.REACT_APP_RECAPTCHA_KEY}
          theme="dark"
          verifyCallback={verifyCallback}
        />
      </div>
      <br />
      <p className={styles.errorMessage}>{error}</p>
      <div style={{paddingLeft: "13px", display: "flex", }}>
        <button
          className="form-control"
          style={{ width: "100px" }}
          disabled={registering}
          onClick={(event) => {
            event.preventDefault();
            setParentPage("address-info");
          }}
        >
          Back
        </button>
        <div style={{ paddingLeft: "10px", paddingRight: "10px"}}>
          <button
            disabled={registering}
            className="form-control"
            style={{ width: "100px" }}
            onClick={(event) => {
              event.preventDefault();
              console.log("button clicked");
              if (validatePassword(password, repeatedPassword, setError)) {
                console.log("recaptcha: ", recaptchaPassed);
                if (!recaptchaPassed) {
                  setError("Please complete the recaptcha");
                  return;
                } else {
                  setRegistering(true);
                  console.log('setregistering')
                  onRegister(parentFormData.current)
                    .then(() => {
                      setRegistering(false);
                    })
                    .catch((e) => {
                      setRegistering(false);
                      setError("There was a problem registering this account.");
                    });
                }
              }
            }}
          >
            Register
          </button>
        </div>
        {registering && (
          <ScaleLoader
            color={"#FFFFFF"}
            loading={true}
            size={20}
            speedMultiplier={0.5}
          />
        )}
      </div>
    </div>
  );
};
