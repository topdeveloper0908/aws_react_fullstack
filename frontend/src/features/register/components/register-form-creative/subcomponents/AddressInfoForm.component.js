import React, { useState, useEffect } from "react";
import { CountryDropdown } from "../../../../../components/country-dropdown/CountryDropdown.component";
import { geocodeRequest } from "../../../../../services/geocoder/geocoder.service";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import styles from "../register-form-creative.module.css";

export const AddressInfoForm = ({ parentFormData, setParentPage }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    streetAddressLine1: parentFormData.current.streetAddressLine1,
    streetAddressLine2: parentFormData.current.streetAddressLine2,
    city: parentFormData.current.city,
    stateOrProvince: "AL",
    postalCode: parentFormData.current.zip,
    country: parentFormData.current.country,
    cell: parentFormData.current.cell,
  });

  const [error, setError] = useState("");

  const setParentAndChildFormData = (property, event) => {
    const { value } = event.target;
    parentFormData.current = {
      ...parentFormData.current,
      [property]: event.target.value,
    };
    setFormData({ ...formData, [property]: value });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.subheading}>Address Info</h2>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="streetAddressLine1">Street Address*</label>
          <br />
          <input
            className="textInput"
            type="text"
            id="streetAddressLine1"
            name="streetAddressLine1"
            value={formData.streetAddressLine1}
            onChange={(e) => {
              setParentAndChildFormData("streetAddressLine1", e);
            }}
          />
        </div>
      </div>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="streetAddressLine2">Street Address Line 2</label>
          <br />
          <input
            className="textInput"
            type="text"
            id="streetAddressLine2"
            name="streetAddressLine2"
            value={formData.streetAddressLine2}
            onChange={(e) => {
              setParentAndChildFormData("streetAddressLine2", e);
            }}
          />
        </div>
      </div>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="city">City*</label>
          <br />
          <input
            className="textInput"
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={(e) => {
              setParentAndChildFormData("city", e);
            }}
          />
        </div>
        <div className="labelInputGroup">
          <label htmlFor="stateOrProvince">State/Province*</label>
          <br />
          {formData.country === "United States of America" ? (
            <select
              className="textInput"
              id="stateOrProvince"
              name="stateOrProvince"
              value={formData.stateOrProvince}
              onChange={(e) => {
                setParentAndChildFormData("stateOrProvince", e);
              }}
            >
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
          ) : (
            <input
              type="text"
              value={formData.stateOrProvince}
              id="stateOrProvince"
              name="stateOrProvince"
              className="textInput"
              onChange={(e) => {
                setParentAndChildFormData("stateOrProvince", e);
              }}
            />
          )}
          <br />
        </div>
        <div className="labelInputGroup">
          <label htmlFor="postalCode">Zip/Postal Code*</label>
          <br />
          <input
            className="textInput"
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onKeyDown={(e) => {
              //if the key isn't backspace, delete, tab, the arrow keys, or a number, don't change the value
              if (
                e.key !== "Backspace" &&
                e.key !== "Delete" &&
                e.key !== "Tab" &&
                e.key !== "." &&
                e.key !== "ArrowLeft" &&
                e.key !== "ArrowRight" &&
                e.key !== "ArrowUp" &&
                e.key !== "ArrowDown" &&
                !e.key.match(/\d/)
              ) {
                e.preventDefault();
              }
            }}
            onChange={(e) => {
              parentFormData.current = {
                ...parentFormData.current,
                postalCode: e.target.value,
              };
              setFormData({
                ...formData,
                postalCode: e.target.value,
              });
            }}
          />
          <br />
        </div>
      </div>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="country">Country</label>
          <CountryDropdown
            className="textInput"
            id="country"
            name="country"
            value={formData.country}
            onChange={(e) => {
              if (e.target.value === "United States of America") {
                setFormData({
                  ...formData,
                  country: e.target.value,
                  stateOrProvince: "AL",
                });
                parentFormData.current = {
                  ...parentFormData.current,
                  country: e.target.value,
                  stateOrProvince: "AL",
                };
              } else {
                setFormData({
                  ...formData,
                  country: e.target.value,
                  stateOrProvince: "",
                });
                parentFormData.current = {
                  ...parentFormData.current,
                  country: e.target.value,
                  stateOrProvince: "",
                };
              }
            }}
          />
        </div>
      </div>
      <div className="formRow">
        <div className="labelInputGroup">
          <label htmlFor="cell">Cell</label>
          <PhoneInput
            placeholder="Enter phone number"
            value={formData.cell}
            onChange={(v) => {
              setFormData({ ...formData, cell: v });
              parentFormData.current = {
                ...parentFormData.current,
                cell: v,
              };
            }}
          />
        </div>
      </div>
      <p className={styles.errorMessage}>{error}</p>
      <div style={{ display: "flex" }}>
        <button
          className="form-control"
          style={{ width: "100px" }}
          onClick={(event) => {
            event.preventDefault();
            setParentPage("artist-info");
          }}
        >
          Back
        </button>
        <div style={{paddingLeft: "10px"}}>
          <button
            className="form-control"
            style={{ width: "100px" }}
            onClick={async (event) => {
              event.preventDefault();
              let checksPassed = true;
              if (!formData.streetAddressLine1.length > 0) {
                const input = document.getElementById("streetAddressLine1");
                input.classList.add(`${styles.required}`);
                checksPassed = false;
              }
              if (!formData.city.length > 0) {
                const input = document.getElementById("city");
                input.classList.add(`${styles.required}`);
                checksPassed = false;
              }
              if (checksPassed) {
                try {
                  const geoData = await geocodeRequest(formData);
                  if (geoData.lat && geoData.lng) {
                    parentFormData.current = {
                      ...parentFormData.current,
                      lat: geoData.lat,
                      lng: geoData.lng,
                    };
                    setParentPage("password");
                  } else {
                    setError("There was a problem finding the address.");
                  }
                } catch (e) {
                  setError("There was a problem finding the address.");
                }
              } else {
                setError("Please complete all of the required fields.");
              }
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
