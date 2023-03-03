import React, { useEffect, createContext, useState } from "react";
import { getCSRFToken } from "./crsf-protection.service";

//used to determine whether the csrf token has been loaded, for instance when an account exec code is used to register
export const CSRFProtectionContext = createContext();

export const CSRFProtectionContextProvider = ({ children }) => {
  const [tokenLoaded, setTokenLoaded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    //set the token in the headers for all requests
    getCSRFToken()
      .then(() => {
        setTokenLoaded(true);
        console.log("getCSRFToken: " );
      })
      .catch((e) => {
        setError("CSRF ERROR: " + e.message);
      });
  }, []);

  return (
    <CSRFProtectionContext.Provider value={{ tokenLoaded }}>
      {children}
    </CSRFProtectionContext.Provider>
  );
};
