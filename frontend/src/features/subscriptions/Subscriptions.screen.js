import React, { useContext, useRef } from "react";
import { SubscriptionsContext } from "../../services/subscriptions/subscriptions.context";
import { PlanSelection } from "./plan-selection/PlanSelection.component";
import { SubscriptionForm } from "./subscription-form/SubscriptionForm.component";

export const SubscriptionsScreen = () => {
  const { clientSecret } = useContext(SubscriptionsContext);
  const planRef = useRef("monthly");

  return (
    <div
      style={{
        backgroundColor: "#121212",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      {clientSecret ? (
        <SubscriptionForm planRef={planRef} />
      ) : (
        <PlanSelection planRef={planRef} />
      )}
    </div>
  );
};
