import React, { createContext, useState, useContext } from "react";
import { AuthenticationContext } from "../authentication/authentication.context";
import { userSearchRequest } from "./search.service";

export const SearchContext = createContext();

export const SearchContextProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthenticationContext);
  const [searchType, setSearchType] = useState("Show All");
  const [results, setResults] = useState([]);
  const [creativeResults, setCreativeResults] = useState([]);
  const [businessResults, setBusinessResults] = useState([]);
  const [eventResults, setEventResults] = useState([]);
  // const [productResults, setProductResults] = useState([]);
  const [resourceResults, setResourceResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState();

  const onSearch = async ({
    searchType,
    searchTerm,
    showLocalResultsOnly,
    radius,
    zip,
    lat,
    lng,
  }) => {
    console.log("onSearch: searchType: ", searchType, ", searchTerm: ", searchTerm,
      ", showLocalResultsOnly: ", showLocalResultsOnly, ", radius: ", radius, ", zip: ", zip, 
      ", lat: ", lat, ", lng: ", lng
    )
    return new Promise(async (resolve, reject) => {
      let originatorID = "";
      if (isAuthenticated && user) originatorID = user._id;
      try {
        const res = await userSearchRequest({
          searchType,
          searchTerm,
          showLocalResultsOnly,
          radius,
          zip,
          lat,
          lng,
          originatorID,
        });
        //creatives, businesses, and resources
        const { users } = res.data;
        const { events } = res.data;
        // const { products } = res.data;
        //set the search result type so the UI can render the correct presentation component for a single result
        users.forEach((user) => {
          user.searchResultType = "user";
        });
        events.forEach((event) => {
          event.searchResultType = "event";
        });
        // products.forEach((product) => {
        //   product.searchResultType = "product";
        // });
        setResults([...users, ...events]);
        setCreativeResults(
          users.filter((u) => {
            return u.type === "creative";
          })
        );
        setBusinessResults(
          users.filter((u) => {
            return u.type === "business";
          })
        );
        setEventResults(events);
        // setProductResults(products);
        setResourceResults(
          users.filter((u) => {
            return u.type === "resource";
          })
        );
        resolve();
      } catch (e) {
        reject(e);
        setResults([]);
      }
    });
  };

  return (
    <SearchContext.Provider
      value={{
        results,
        creativeResults,
        businessResults,
        eventResults,
        // productResults,
        resourceResults,
        onSearch,
        setResults,
        selectedResult,
        setSelectedResult,
        searchType,
        setSearchType,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
