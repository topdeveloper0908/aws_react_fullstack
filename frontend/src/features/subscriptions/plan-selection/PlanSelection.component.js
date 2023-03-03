import React, { useState, useContext } from "react";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { SubscriptionsContext } from "../../../services/subscriptions/subscriptions.context";
import styles from "./plan-selection.module.css";
import { TermsAndConditions } from "./terms-and-conditions/TermsAndConditions.component";

export const PlanSelection = () => {
  const { user } = useContext(AuthenticationContext);
  const { onSubscriptionRequest } = useContext(SubscriptionsContext);

  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  return (
    <div className={styles.outerContainer}>
      <h2>
        <span style={{ color: "yellow" }}>Almost there!</span> Select a plan to
        complete your registration.
      </h2>
      <h3>
        All plans include unlimited access to the full set of features,
        including media uploads, booking requests, and event scheduling.
        <br />
        <br />
        <i>IMPORTANT: All prices below include an 8.625% sales tax.</i>
      </h3>
      <div className={styles.singlePlanView}></div>
      <div className={styles.labelContainer}>
        <div>
          <input
            type="radio"
            id="monthly"
            name="plan"
            value="monthly"
            checked={selectedPlan === "monthly"}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPlan("monthly");
              }
            }}
          />
          <label
            htmlFor="monthly"
            className={`${styles.label} ${
              selectedPlan === "monthly" ? styles.selected : ""
            }`}
          >
            Monthly ($32.59 / month)
          </label>
        </div>

        <div>
          <input
            type="radio"
            id="yearly"
            name="plan"
            value="yearly"
            checked={selectedPlan === "yearly"}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPlan("yearly");
              }
            }}
          />
          <label
            htmlFor="yearly"
            className={`${styles.label} ${
              selectedPlan === "yearly" ? styles.selected : ""
            }`}
          >
            Yearly ($271.56 / year)
          </label>
        </div>
        <div>
          <input
            type="radio"
            id="lifetime"
            name="plan"
            value="lifetime"
            checked={selectedPlan === "lifetime"}
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedPlan("lifetime");
              }
            }}
          />
          <label
            htmlFor="lifetime"
            className={`${styles.label} ${
              selectedPlan === "lifetime" ? styles.selected : ""
            }`}
          >
            Lifetime $1,629.38 (one-time)
          </label>
        </div>
        {user.country === "United States of America" && (
          <div>
            <input
              type="radio"
              id="artistpack"
              name="plan"
              value="artistpack"
              checked={selectedPlan === "artistpack"}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedPlan("artistpack");
                }
              }}
            />
            <label
              htmlFor="artistpack"
              className={`${styles.label} ${
                selectedPlan === "artistpack" ? styles.selected : ""
              }`}
            >
              Artist Pack $325.88 for 3 month membership
            </label>
          </div>
        )}
      </div>
      <button
      style={{width:"120px"}}
        className="form-control"
        disabled={!selectedPlan}
        onClick={() => {
          setShowModal(true);
        }}
      >
        Next
      </button>
      {showModal && (
        <TermsAndConditions
          closeSelf={() => {
            setShowModal(false);
          }}
          acceptTermsAndConditions={() => {
            onSubscriptionRequest(user, selectedPlan);
          }}
        />
      )}
    </div>
  );
};
