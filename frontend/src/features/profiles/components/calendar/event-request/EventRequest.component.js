import React, { useState, useContext } from "react";
import { AuthenticationContext } from "../../../../../services/authentication/authentication.context";
import { min, max, getShortTZ } from "../utils";
import styles from "./event-request.module.css";
import { TimeSelect } from "../TimeSelect/TimeSelect.component";
import { eventReqRequest } from "../../../../../services/calendar/calendar.service";
import { CountryDropdown } from "../../../../../components/country-dropdown/CountryDropdown.component";
import { DateTime } from "luxon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export const EventRequest = ({
  tz,
  selectedTimes,
  closeSelf,
  recipientID,
  recipientName,
}) => {
  const { user, onEventReqAction } = useContext(AuthenticationContext);
  const { year: y, month: m, date: d } = selectedTimes[0]; // grab the default times;
  const [year, setYear] = useState(y); //create states to house year, month and date
  const [month, setMonth] = useState(m);
  const [date, setDate] = useState(d);
  const sT = min(selectedTimes); //grab default start/end time values
  const eT = max(selectedTimes);
  const [startTime, setStartTime] = useState(sT);
  const [endTime, setEndTime] = useState(eT);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [isOnline, setIsOnline] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isOnline: false,
    link: "",
    venueName: "",
    streetAddressLine1: "",
    streetAddressLine2: "",
    city: "",
    stateOrProvince: "AL",
    postalCode: "",
    payrateOffer: "",
    message: "",
    country: "United States of America",
  });

  const [requestSucceeded, setRequestSucceeded] = useState(false);

  return (
    <div className={styles.modal} id="modal">
      <div className={styles.closeBtnContainer}>
        <button onClick={closeSelf} className={styles.closeBtn}>
          <FontAwesomeIcon icon={faTimes} color="white" size="2x" />
        </button>
      </div>
      {!requestSucceeded ? (
        <>
          <h2 className={styles.heading}>Send a Scheduling Request</h2>
          <h3 className={styles.heading}>Event Information</h3>
          <h3 className={styles.heading}>
            <div className="formRow">
              <div className="labelInputGroup">
                <label>Start Time</label>
                <TimeSelect
                  value={startTime}
                  onChange={(e) => {
                    setStartTime(e.target.value);
                    //if the start time is greater than the end time, make the end time equal to the start time
                    if (Number(e.target.value) > Number(endTime)) {
                      setEndTime(e.target.value);
                    }
                  }}
                  add15MinutesToHud={false}
                />
              </div>
              <div className="labelInputGroup">
                <label>End Time</label>
                <TimeSelect
                  value={endTime}
                  onChange={(e) => {
                    setEndTime(e.target.value);
                    //if end time is less than the start time, make the start time equal to the end time
                    if (Number(e.target.value) < Number(startTime)) {
                      setStartTime(e.target.value);
                    }
                  }}
                  add15MinutesToHud={true}
                />
              </div>
              <div className="labelInputGroup">
                <label htmlFor="date">Date</label>
                <input
                  className="textInput"
                  type="date"
                  id="date"
                  value={(() => {
                    let paddedMonth = month;
                    let paddedDate = date;
                    if (paddedMonth.length < 2)
                      paddedMonth = "0".concat(paddedMonth);
                    if (paddedDate.length < 2)
                      paddedDate = "0".concat(paddedDate);
                    return `${year}-${paddedMonth}-${paddedDate}`;
                  })()}
                  onChange={(e) => {
                    //if the year would be longer than 4 digits, prevent the value from changing
                    if (e.target.value.length > 10) {
                      e.preventDefault();
                      return;
                    }
                    //if the new value is an invalid date or NaN, prevent it from changing
                    if (
                      new Date(e.target.value) === "Invalid Date" ||
                      isNaN(new Date(e.target.value))
                    ) {
                      e.preventDefault();
                      return;
                    }
                    const splitDate = e.target.value.split("-");
                    const y = splitDate[0];
                    const m = splitDate[1];
                    const d = splitDate[2];
                    setYear(y);
                    setMonth(m);
                    setDate(d);
                  }}
                />
              </div>
              <h3 className={styles.timezone}>{getShortTZ(tz)}</h3>
            </div>
          </h3>

          <label htmlFor="title" className={styles.label}>
            Event Name
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={styles.textInput}
            value={formData.title}
            onChange={(event) => {
              //when the user begins typing, remove the required class from the field
              event.target.classList.remove(styles.required);
              setFormData({ ...formData, title: event.target.value });
            }}
          />
          <br />
          <label htmlFor="description" className={styles.label}>
            Describe the Event
          </label>
          <textarea
            id="description"
            name="description"
            className={styles.textarea}
            value={formData.description}
            onChange={(event) => {
              //when the user begins typing, remove the required class from the field
              event.target.classList.remove(styles.required);
              setFormData({ ...formData, description: event.target.value });
            }}
          />
          <br />
          <label htmlFor="location" className={styles.label}>
            Please Enter the Location
          </label>
          {!isOnline && (
            <>
              <label htmlFor="venueName" className={styles.label}>
                Venue
              </label>
              <input
                type="text"
                id="venueName"
                name="venueName"
                className={styles.textInput}
                value={formData.venueName}
                onChange={(event) => {
                  //when the user begins typing, remove the required class from the field
                  event.target.classList.remove(styles.required);
                  setFormData({ ...formData, venueName: event.target.value });
                }}
              />
              <br />
              <label htmlFor="streetAddressLine1" className={styles.label}>
                Street Address
              </label>
              <input
                type="text"
                id="streetAddressLine1"
                name="streetAddressLine1"
                className={styles.textInput}
                value={formData.streetAddressLine1}
                onChange={(event) => {
                  //when the user begins typing, remove the required class from the field
                  event.target.classList.remove(styles.required);
                  setFormData({
                    ...formData,
                    streetAddressLine1: event.target.value,
                  });
                }}
              />
              <br />
              <label htmlFor="streetAddressLine2" className={styles.label}>
                Street Address Line 2
              </label>
              <input
                type="text"
                id="streetAddressLine2"
                name="streetAddressLine2"
                className={styles.textInput}
                value={formData.streetAddressLine2}
                onChange={(event) => {
                  setFormData({
                    ...formData,
                    streetAddressLine2: event.target.value,
                  });
                }}
              />
              <br />
              <div className={styles.formRow}>
                <div className={styles.labelInputGroupLg}>
                  <label htmlFor="city" className={styles.label}>
                    City
                  </label>
                  <br />
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className={styles.textInput}
                    value={formData.city}
                    onChange={(event) => {
                      //when the user begins typing, remove the required class from the field
                      event.target.classList.remove(styles.required);
                      setFormData({ ...formData, city: event.target.value });
                    }}
                  />
                </div>
                <div className={styles.labelInputGroupSm}>
                  <label htmlFor="stateOrProvince" className={styles.label}>
                    State/Province
                  </label>
                  <br />
                  {formData.country === "United States of America" ? (
                    <select
                      className="textInput"
                      id="stateOrProvince"
                      name="stateOrProvince"
                      value={formData.stateOrProvince}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          stateOrProvince: e.target.value,
                        });
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
                        setFormData({
                          ...formData,
                          stateOrProvince: e.target.value,
                        });
                      }}
                    />
                  )}
                </div>
                <div className={styles.labelInputGroupSm}>
                  <label htmlFor="postalCode" className={styles.label}>
                    Postal Code*
                  </label>
                  <br />
                  <input
                    className={styles.textInput}
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={(event) => {
                      //when the user begins typing, remove the required class from the field
                      event.target.classList.remove(styles.required);
                      setFormData({
                        ...formData,
                        postalCode: event.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="country" className={styles.label}>
                  Country
                </label>
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
                    } else {
                      setFormData({
                        ...formData,
                        country: e.target.value,
                        stateOrProvince: "",
                      });
                    }
                  }}
                />
              </div>
            </>
          )}
          <br />
          <div>
            <input
              type="checkbox"
              id="isOnline"
              name="isOnline"
              onChange={(event) => {
                setFormData({ ...formData, isOnline: event.target.checked });
                setIsOnline(event.target.checked);
              }}
            />
            <label htmlFor="isOnline" className={styles.label}>
              This is an online/remote event.
            </label>
          </div>
          <br />
          <label htmlFor="payrateOffer" className={styles.label}>
            Proposed Rate of Pay
          </label>
          <input
            name="payrateOffer"
            id="payrateOffer"
            className="textInput"
            type="text"
            value={formData.payrateOffer}
            onChange={(e) => {
              e.target.classList.remove(styles.required);
              setFormData({ ...formData, payrateOffer: e.target.value });
            }}
          />
          <h3 className={styles.heading}>Message to Creative</h3>
          <textarea
            className={styles.textarea}
            id="message"
            name="message"
            value={formData.message}
            onChange={(e) => {
              e.target.classList.remove(styles.required);
              setFormData({ ...formData, message: e.target.value });
            }}
          />
          <p className={styles.errorMessage}>{error}</p>
          <div className={styles.btnRow}>
            <button
              onClick={closeSelf}
              className="btn-cancel"
              disabled={sending}
            >
              Cancel
            </button>
            <button
              className="btn-save"
              disabled={sending}
              onClick={() => {
                //frontend validation
                //verify that all required fields are complete
                let incompleteFields = [];
                if (
                  !year ||
                  !month ||
                  !date ||
                  year.isNaN ||
                  month.isNaN ||
                  date.isNaN
                ) {
                  incompleteFields.push("date");
                }
                if (!formData.title.length > 0) incompleteFields.push("title");
                if (!formData.description.length > 0)
                  incompleteFields.push("description");
                if (!formData.payrateOffer.length > 0)
                  incompleteFields.push("payrateOffer");
                if (!formData.message.length > 0)
                  incompleteFields.push("message");
                if (!formData.isOnline) {
                  if (!formData.venueName.length > 0)
                    incompleteFields.push("venueName");
                  if (!formData.streetAddressLine1.length > 0)
                    incompleteFields.push("streetAddressLine1");
                  if (!formData.city.length > 0) incompleteFields.push("city");
                  // if (!formData.stateOrProvince.length > 0)
                  //   incompleteFields.push("stateOrProvince");
                  if (!formData.postalCode.length > 0)
                    incompleteFields.push("postalCode");
                  if (!formData.country.length > 0)
                    incompleteFields.push("country");
                }
                if (incompleteFields.length > 0) {
                  for (const field of incompleteFields) {
                    document
                      .getElementById(field)
                      .classList.add(styles.required);
                  }
                  setError("Please complete all of the required fields.");
                  return;
                }
                const sT = DateTime.fromObject(
                  {
                    year: year,
                    month: month,
                    day: date,
                    hour: Number(startTime.slice(0, 2)),
                    minute: Number(startTime.slice(2)),
                  },
                  {
                    zone: tz,
                  }
                ).toUTC();
                const eT = DateTime.fromObject(
                  {
                    year: year,
                    month: month,
                    day: date,
                    hour: Number(endTime.slice(0, 2)),
                    minute: Number(endTime.slice(2)),
                  },
                  {
                    zone: tz,
                  }
                ).toUTC();
                //sending and errors
                setSending(true);
                eventReqRequest(recipientID, {
                  ...formData,
                  startTime: sT,
                  endTime: eT,
                })
                  .then(() => {
                    onEventReqAction(recipientID)
                      .then(() => {
                        setRequestSucceeded(true);
                        setSending(false);
                      })
                      .catch((e) => {
                        console.log(e);
                      });
                  })
                  .catch((e) => {
                    setError("Could not create the message request.");
                    setSending(false);
                  });
              }}
            >
              Send Request
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className={styles.heading}>Request Successfully Sent</h2>
          <p className={styles.text}>
            You will be notified once the recipient responds to your request.
          </p>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              className="btn"
              style={{ width: "100px" }}
              onClick={closeSelf}
            >
              Ok
            </button>
          </div>
        </>
      )}
    </div>
  );
};
