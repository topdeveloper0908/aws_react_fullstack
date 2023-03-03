import React, { useState, createContext } from "react";
import {
  createSubscription,
  createLifetimeMembershipPaymentIntent,
  createAPMembershipPaymentIntent,  
} from "./subscriptions.service";

export const SubscriptionsContext = createContext();

export const SubscriptionsContextProvider = ({ children }) => {
  const [subscriptionId, setSubscriptionId] = useState(null);
  const [planType, setPlanType] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const onSubscriptionRequest = (user, type) => {
    console.log("onSubscriptionRequest: user: ", user, ", type: ", type);
    return new Promise(async (resolve, reject) => {
      if (!user) reject("No user found.");
      // const {  stripeCustomerID } = user;
      // const customerId='cus_N8cvUsZKiVmXDq' ;
      if (type === "monthly" || type === "yearly") {
        let priceId;
        switch (type) {
          case "monthly":
            priceId = "price_1MOLgqHXnCGRiN0arrCYrOOU"
            // price_1MOLgqHXnCGRiN0arrCYrOOU; //"price_1L7vktK5nziMyc2XqSNbml89";
            break;
          case "yearly":
            // priceId = "price_1L3a0DK5nziMyc2XO4MKRsTo"; //"price_1L7vlWK5nziMyc2XDA54XxZj";
            priceId = "price_1MOLgqHXnCGRiN0arrCYrOOU"; //"price_1MOLgqHXnCGRiN0arrCYrOOU";
            break;
          default:
            // priceId = "price_1L3Zy8K5nziMyc2XdyVc7N88"; //default case is monthly "price_1L7vktK5nziMyc2XqSNbml89";
            priceId = "price_1MOLgqHXnCGRiN0arrCYrOOU"; //default case is monthly "price_1L7vktK5nziMyc2XqSNbml89";
        }
        try {
          // const newSub = await createSubscription('cus_N8cvUsZKiVmXDq', priceId);
          // setSubscriptionId(newSub.subscriptionId);
          setSubscriptionId("sub_1MPMgUHXnCGRiN0aD4pyl1H6");
          // setClientSecret(newSub.clientSecret);
          console.log('type === "monthly" || type === "yearly"');
          // setClientSecret("pi_3MPMgUHXnCGRiN0a0JfkjDCT_secret_AdaDFl1QkpI6xrisDJ8G2wVwo");
          setPlanType(type);
          resolve();
        } catch (e) {
          setError(e);
          reject(e);
        }
      } else if (type === "lifetime") {
        try {
          // const newLifetimeMembership = await createLifetimeMembershipPaymentIntent('cus_N8cvUsZKiVmXDq');
            console.log('type === "lifetime"');
          // setClientSecret(newLifetimeMembership.clientSecret);
          setPlanType(type);
          resolve();
        } catch (e) {
          setError(e);
        }
      } else if (type === "artistpack") {
        try {
          // const newAPMembership = await createAPMembershipPaymentIntent(
          //   'cus_N8cvUsZKiVmXDq'
          // );
          console.log('type === "artistpack"');
          // setClientSecret(newAPMembership.clientSecret);
          setPlanType(type);
          resolve();
        } catch (e) {
          setError(e);
        }
      }
    });
  };

  return (
    <SubscriptionsContext.Provider
      value={{
        subscriptionId,
        // clientSecret,
        error,
        onSubscriptionRequest,
        planType,
      }}
    >
      {children}
    </SubscriptionsContext.Provider>
  );
};
