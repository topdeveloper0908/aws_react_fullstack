import React, { useState, useContext, useEffect, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { SearchContext } from "../../../services/search/search.context";
import Autocomplete from "react-autocomplete";
import styles from "./search-form.module.css";

export const SearchForm = ({ useSearchScreenStyles }) => {
  const history = useHistory();
  const location = useLocation();

  const autocompleteRef = useRef(null);

  const [showDropDown, setShowDropDown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // const [searchType, setSearchType] = useState("Show All");
  const [showLocalResultsOnly, setShowLocalResultsOnly] = useState(false);
  const [locationMode, setLocationMode] = useState("this-device"); //this device's location, user's location, enter location
  const [radius, setRadius] = useState(25);
  const geocodedLat = useRef("");
  const geocodedLng = useRef("");
  const [advancedSearchError, setAdvancedSearchError] = useState("");

  const { onSearch, searchType, setSearchType } = useContext(SearchContext);
  const { user, userLocation, isAuthenticated } = useContext(
    AuthenticationContext
  );

  const onSubmit = (event) => {
    event.preventDefault();
    if (searchTerm.length > 0) {
      //simple search --> show all results not based on locale
      onSearch({
        searchType: "Show All",
        searchTerm,
        showLocalResultsOnly: false, //show local results only
      })
        .then((_) => {
          history.push("/results");
        })
        .catch((_) => {
          history.push("/results");
        });
    }
  };

  const onAdvancedSearch = (event) => {
    event.preventDefault();
    //make sure there is a search term
    if (!searchTerm.length > 0) {
      setAdvancedSearchError("Please enter a search term.");
      return;
    }
    let lat, lng;
    if (showLocalResultsOnly) {
      switch (locationMode) {
        case "this-device":
          lat = userLocation && userLocation.lat;
          lng = userLocation && userLocation.lng;
          break;
        case "user-location":
          lat = user && user.lat;
          lng = user && user.lng;
          break;
        case "enter-city":
          lat = geocodedLat.current;
          lng = geocodedLng.current;
          break;
        default:
          lat = undefined;
          lng = undefined;
      }
      if (!lat || !lng) {
        if (locationMode === "this-device") {
          setAdvancedSearchError(
            "Could not locate this device. Try entering a city instead."
          );
          return;
        } else if (locationMode === "user-location") {
          setAdvancedSearchError(
            "User location is undefined. Try using this device's location or entering a city instead."
          );
          return;
        } else if (locationMode === "enter-city") {
          setAdvancedSearchError(
            "Please be sure to select a valid location from the suggestions."
          );
          return;
        }
      } else {
        setAdvancedSearchError("");

        onSearch({
          searchType,
          searchTerm,
          showLocalResultsOnly,
          radius,
          lat,
          lng,
        })
          .then((_) => {
            history.push(`/results`);
          })
          .catch((_) => {
            history.push(`/results`);
          });
      }
    } else {
      //if searching for results regardless of location
      onSearch({
        searchType,
        searchTerm,
        showLocalResultsOnly: false,
      })
        .then((_) => {
          history.push(`/results`);
        })
        .catch((_) => {
          history.push(`/results`);
        });
    }
  };

  // useEffect(() => {
  //   const options = {
  //     fields: ["formatted_address", "geometry", "name"],
  //     strictBounds: false,
  //     types: ["(cities)"],
  //   };
  //   const autocomplete = new window.google.maps.places.Autocomplete(
  //     autocompleteRef.current,
  //     options
  //   );
  //   autocomplete.addListener("place_changed", () => {
  //     const place = autocomplete.getPlace();

  //     if (!place.geometry || !place.geometry.location) {
  //       // User entered the name of a Place that was not suggested and
  //       // pressed the Enter key, or the Place Details request failed.
  //       window.alert("No details available for input: '" + place.name + "'");
  //       return;
  //     }

  //     geocodedLat.current = place.geometry.location.lat();
  //     geocodedLng.current = place.geometry.location.lng();
  //   });
  // }, []);

  return (
    <div className={styles.searchOuterContainer}>
      <form
        className={`${styles.searchInputContainer} ${
          useSearchScreenStyles
            ? styles.searchScreenInputContainer
            : styles.navbarInputContainer
        }`}
        id="search"
        onSubmit={onSubmit}
      >
        <input
          type="text"
          className={styles.searchInput}
          value={searchTerm}
          placeholder="Search..."
          onChange={(event) => {
            setSearchTerm(event.target.value);
          }}
        />
        <div className={styles.buttonContainer}>
          <button
            style={{ border: "none", backgroundColor: "transparent" }}
            type="submit"
            className={styles.searchBtn}
          >
            <FontAwesomeIcon icon={faSearch} size="1x" color={"white"} />
          </button>
          <button
            style={{ border: "none", backgroundColor: "transparent" }}
            onClick={() => {
              setShowDropDown(!showDropDown);
            }}
          >
            <FontAwesomeIcon
              className={styles.settingsCog}
              icon={faMapMarkerAlt}
              size="1x"
              color={showDropDown ? "yellow" : "white"}
            />
          </button>
        </div>
      </form>
      <div
        className={`${styles.settingsDropdown} ${
          showDropDown ? styles.fadeIn : styles.fadeOut
        }`}
      >
        <label>Advanced Search</label>
        <br />
        <label htmlFor="searchType">I'm looking for a...</label>
        <select
          id="searchType"
          name="searchType"
          className={styles.settingsInput}
          value={searchType}
          onChange={(event) => {
            setSearchType(event.target.value);
          }}
        >
          <option value="Show All">Show All Results</option>
          <option value="Creative">Creative</option>
          <option value="Business">Business</option>
          <option value="Resource">Resource</option>
          <option value="Event">Event</option>
        </select>
        <div className={styles.row} style={{ marginTop: "8px" }}>
          <input
            type="checkbox"
            id="showLocalResultsOnly"
            name="showLocalResultsOnly"
            onChange={(event) => {
              setShowLocalResultsOnly(event.target.checked);
            }}
          />
          <label htmlFor="showLocalResultsOnly" style={{ paddingLeft: "10px"}}>Show Only Results Within</label>
        </div>
        <div className={styles.row}>
          <select
            id="radius"
            name="radius"
            value={radius}
            disabled={!showLocalResultsOnly}
            onChange={(event) => {
              setRadius(event.target.value);
            }}
            className={styles.settingsInputt}
          >
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={200}>200</option>
          </select>
          <label style={{ width: "104px", marginRight: "4px", marginLeft: "5px" }}>miles of</label>
        </div>
        {userLocation && (
          <div className={styles.row} style={{ marginTop: "8px" }}>
            <input
              type="radio"
              id="this-device"
              name="locationMode"
              onChange={(event) => {
                setLocationMode("this-device");
              }}
            />
            <label htmlFor="this-device" style={{ paddingLeft: "10px"}}>Use this Device's Location</label>
          </div>
        )}
        {isAuthenticated && user && (
          <div className={styles.row} style={{ marginTop: "8px" }}>
            <input
              type="radio"
              id="user-location"
              name="locationMode"
              onChange={(event) => {
                setLocationMode("user-location");
              }}
            />
            <label
              htmlFor="user-location"
              className={styles.userLocationLabel}
            >{`${user.city}, ${
              user.stateOrProvince ? `${user.stateOrProvince}, ` : ""
            }${user.country}`}</label>
          </div>
        )}
        <div className={styles.row} style={{ marginTop: "8px" }}>
          <input
            type="radio"
            id="enter-city"
            name="locationMode"
            onChange={(event) => {
              setLocationMode("enter-city");
            }}
          />
          <label htmlFor="enter-city" style={{ paddingLeft: "10px"}}>Enter a City:</label>
        </div>
        <div style={{ height: "36px" }}></div>
        <div
          className={styles.row}
          style={{ opacity: locationMode === "enter-city" ? 1 : 0 }}
        >
          <div className="pac-container">
            <input
              type="text"
              id="pac-input"
              className={styles.autocomplete}
              ref={autocompleteRef}
            />
          </div>
        </div>
        <p className={styles.errorMessage}>{advancedSearchError}</p>
        <button className="btn-save" onClick={onAdvancedSearch}>
          <FontAwesomeIcon icon={faSearch} size="1x" /> Advanced Search
        </button>
      </div>
    </div>
  );
};
