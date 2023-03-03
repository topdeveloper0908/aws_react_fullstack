import React, { useState, useContext, useEffect } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import axios from "axios";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { CSRFProtectionContext } from "../../../services/csrf-protection/csrf-protection.context";
import { RegisterFormCreative } from "../components/register-form-creative/RegisterFormCreative";
import { RegisterFormBusiness } from "../components/register-form-business/RegisterFormBusiness";
import { RegisterFormResource } from "../components/register-form-resource/RegisterFormResource";
import { Footer } from "../../../components/footer/Footer.component";
import styles from "./register.module.css";

export const RegisterScreen = () => {
  const { userType } = useContext(AuthenticationContext);
  const { tokenLoaded } = useContext(CSRFProtectionContext);
  const [formToShow, setFormToShow] = useState(userType || "creative");
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAccountExec, setIsAccountExec] = useState(false);
  const [error, setError] = useState("");

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const code = params.get("accountexec");
  const referrer = params.get("referrer");
  const promoCode = params.get("joincode");
  useEffect(() => {
    window.scrollTo(0, 0);
    if (!code) setIsLoading(false);
    else if (tokenLoaded) {
      axios
        .post("/verify_account_exec_code", { code })
        .then(() => {
          setIsAccountExec(true);
          setIsLoading(false);
        })
        .catch(() => {
          setError("Invalid account executive code or code expired.");
          setIsLoading(false);
        });
    }
  }, [tokenLoaded]);

  return (
    <>
      <div className={styles.registerScreen} id="register-form">
        {isLoading ? (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ScaleLoader
              color={"#FFFFFF"}
              loading={true}
              size={40}
              speedMultiplier={0.5}
            />
            <p>Checking codes...</p>
          </div>
        ) : (
          <div className={styles.registerForm}>
            <h1 className={styles.heading}>
              {isAccountExec ? "Register as Account Executive" : "Register"}
            </h1>
            {(() => {
              if (!showForm) {
                return (
                  <>
                    <label>
                      Sign up as a{" "}
                      <select
                        className={styles.select}
                        value={formToShow}
                        onChange={(event) => {
                          setFormToShow(event.target.value);
                        }}
                      >
                        <option value="creative">creative</option>
                        <option value="business">business</option>
                        <option value="resource">resource</option>
                      </select>
                    </label>
                    <br/>
                    <div></div>
                    <button
                      style={{ width: "120px" }}
                      className="form-control"
                      onClick={() => {
                        if (formToShow) {
                          setShowForm(true);
                        }
                      }}
                    >
                      Next
                    </button>
                  </>
                );
              } else {
                switch (formToShow) {
                  case "creative":
                    return (
                        <RegisterFormCreative
                        accountExecCode={code}
                        referrer={referrer}
                        promoCode={promoCode}
                      />
                    );
                  case "business":
                    return (
                      <RegisterFormBusiness
                        accountExecCode={code}
                        referrer={referrer}
                        promoCode={promoCode}
                      />
                    );
                  case "resource":
                    return (
                      <RegisterFormResource
                        accountExecCode={code}
                        referrer={referrer}
                        promoCode={promoCode}
                      />
                    );
                  default:
                    return (
                      <RegisterFormCreative
                        accountExecCode={code}
                        referrer={referrer}
                        promoCode={promoCode}
                      />
                    );
                }
              }
            })()}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
