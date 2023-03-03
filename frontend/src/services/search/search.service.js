import axios from "axios";

export const userSearchRequest = ({
  searchType,
  searchTerm,
  showLocalResultsOnly,
  radius,
  lat,
  lng,
  originatorID,
}) => {
  console.log("userSearchRequest: searchType: ", searchType, ", searchTerm: ", searchTerm,
      ", showLocalResultsOnly: ", showLocalResultsOnly, ", radius: ", radius,
      ", lat: ", lat, ", lng: ", lng, ", originatorID: ", originatorID
    )
  return new Promise(async (resolve, reject) => {
    let sType;
    //events aren't specifically searched for, rather the search results page should be set to defaulting to display events
    //when that type of search is selected
    if (searchType === "Show All" || searchType === "Events") {
      sType = "All";
    } else sType = searchType;
    try {
      if (showLocalResultsOnly && radius && lat && lng) {
        const res = await axios.get(
          `/search?searchtype=${sType}&searchterm=${searchTerm}&showlocalresultsonly=true&radius=${radius}&latitude=${lat}&longitude=${lng}&originatorid=${originatorID}`
        );
        resolve(res);
      } else {
        const res = await axios.get(
          `/search?searchtype=${sType}&searchterm=${searchTerm}&originatorid=${originatorID}`
        );
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};
