import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import { DateTime } from "luxon";
import { AuthenticationContext } from "../../../../../services/authentication/authentication.context";
import { CalendarContext } from "../../../../../services/calendar/calendar.context";
import { geocodeRequest } from "../../../../../services/geocoder/geocoder.service";
import { CountryDropdown } from "../../../../../components/country-dropdown/CountryDropdown.component";
import styles from "./scheduler.module.css";
import {
  iterateThroughTimes,
  militaryToStandard,
  getShortTZ,
  min,
  max,
  add15Minutes,
  mergeDeep,
} from "../utils";
import { TimeSelect } from "../TimeSelect/TimeSelect.component";
import { checkUris } from "../../../../../services/webrisk-api/webrisk-api.service";

export const Scheduler = ({ tz, selectedTimes, closeSelf }) => {
  const { user, setUser } = useContext(AuthenticationContext);
  const { onCreateEvent, prefilledEventData } = useContext(CalendarContext);
  let { year: y, month: m, date: d } = selectedTimes[0]; // grab the default times;
  let sT = min(selectedTimes); //grab default start/end time values
  let eT = max(selectedTimes);
  //if there is prefilled event data, that should take precedence
  if (prefilledEventData) {
    const prefilledStartDateTime = DateTime.fromISO(
      prefilledEventData.startTime
    );
    const prefilledEndDateTime = DateTime.fromISO(prefilledEventData.endTime);
    y = prefilledStartDateTime.year;
    m = prefilledStartDateTime.month.toString();
    d = prefilledStartDateTime.day.toString();
    if (m.length < 2) m = "0".concat(m);
    if (d.length < 2) d = "0".concat(d);
    let prefilledStartHour = prefilledStartDateTime.hour.toString();
    if (prefilledStartHour.length < 2)
      prefilledStartHour = "0".concat(prefilledStartHour);
    let prefilledStartMinute = prefilledStartDateTime.minute.toString();
    if (prefilledStartMinute.length < 2)
      prefilledStartMinute = "0".concat(prefilledStartMinute);
    sT = prefilledStartHour.concat(prefilledStartMinute);
    //create an end time string
    let prefilledEndHour = prefilledEndDateTime.hour.toString();
    if (prefilledEndHour.length < 2)
      prefilledEndHour = "0".concat(prefilledEndHour);
    let prefilledEndMinute = prefilledEndDateTime.minute.toString();
    if (prefilledEndMinute.length < 2)
      prefilledEndMinute = "0".concat(prefilledEndMinute);
    eT = prefilledEndHour.concat(prefilledEndMinute);
    //for now, if the prefilled end time is less than the start time, set it to 2345
    if (Number(eT) < Number(sT)) {
      eT = "2345";
    }
  }

  const [year, setYear] = useState(y); //create states to house year, month and date
  const [month, setMonth] = useState(m);
  const [date, setDate] = useState(d);
  const [startTime, setStartTime] = useState(sT);
  const [endTime, setEndTime] = useState(eT);

  const [error, setError] = useState("");
  const [tagToAdd, setTagToAdd] = useState("");

  const [isOnline, setIsOnline] = useState(false);
  const [formData, setFormData] = useState({
    title: prefilledEventData ? prefilledEventData.title : "",
    isPublic: true,
    description: prefilledEventData ? prefilledEventData.description : "",
    tags: user.tags,
    isOnline: prefilledEventData ? prefilledEventData.isOnline : false,
    link:
      prefilledEventData && prefilledEventData.isOnline
        ? prefilledEventData.link
        : "",
    venueName:
      prefilledEventData && prefilledEventData.venueName
        ? prefilledEventData.venueName
        : "",
    streetAddressLine1:
      prefilledEventData && prefilledEventData.streetAddressLine1
        ? prefilledEventData.streetAddressLine1
        : "",
    streetAddressLine2:
      prefilledEventData && prefilledEventData.streetAddressLine2
        ? prefilledEventData.streetAddressLine2
        : "",
    city:
      prefilledEventData && prefilledEventData.city
        ? prefilledEventData.city
        : "",
    stateOrProvince:
      prefilledEventData && prefilledEventData.stateOrProvince
        ? prefilledEventData.stateOrProvince
        : "AL",
    postalCode:
      prefilledEventData && prefilledEventData.postalCode
        ? prefilledEventData.postalCode
        : "",
    country:
      prefilledEventData && prefilledEventData.country
        ? prefilledEventData.country
        : "United States of America",
    ticketPrice: "",
    ticketsLink: "",
    color: "#008080",
  });

  const [photo, setPhoto] = useState(null);

  return (
    <div className={styles.modal} id="modal">
      <div className={styles.closeBtnContainer}>
        <button onClick={closeSelf} className={styles.closeBtn}>
          <FontAwesomeIcon icon={faTimes} color="white" size="2x" />
        </button>
      </div>
      <h2 className={styles.heading}>Create Event</h2>
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
              id="date"
              className="textInput"
              type="date"
              value={(() => {
                let paddedMonth = month;
                let paddedDate = date;
                if (paddedMonth.length < 2)
                  paddedMonth = "0".concat(paddedMonth);
                if (paddedDate.length < 2) paddedDate = "0".concat(paddedDate);
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
          <h3 style={{ padding: 0, margin: "12px", alignSelf: "flex-end" }}>
            {getShortTZ(tz)}
          </h3>
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
      <label className={styles.label}>
        Add a cover photo: <i>(optional)</i>
      </label>
      <input
        className={styles.fileInput}
        id="photo"
        type="file"
        accept="image/*"
        onChange={(e) => {
          setPhoto(e.target.files[0]);
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
      <div className={styles.tagsOuterContainer}>
        <label htmlFor="add-a-tag" className={styles.label}>
          Add a Tag <i>(events are searchable by tags)</i>
        </label>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
          }}
        >
          <input
            className="textInput"
            type="text"
            id="add-a-tag"
            name="add-a-tag"
            value={tagToAdd}
            onChange={(e) => {
              setTagToAdd(e.target.value);
            }}
          />
          <div className={styles.labelInputButtonGroupButton}>
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!formData.tags.includes(tagToAdd)) {
                  setFormData({
                    ...formData,
                    tags: [...formData.tags, tagToAdd],
                  });
                  setTagToAdd("");
                }
              }}
            >
              +
            </button>
          </div>
        </div>
        <ul className={styles.tagsInnerContainer}>
          {formData.tags &&
            formData.tags?.map((tag) => {
              return (
                <li key={tag} className={styles.tag}>
                  {tag.length <= 12 ? tag : tag.substring(0, 11) + "..."}
                  <button
                    onClick={(event) => {
                      event.preventDefault();
                      const filteredTags = formData.tags.filter((t) => {
                        return t !== tag;
                      });
                      setFormData({ ...formData, tags: filteredTags });
                    }}
                  >
                    <span>
                      <FontAwesomeIcon icon={faTimes} size="1x" />
                    </span>
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
      <label htmlFor="location" className={styles.label}>
        Please Enter the Location
      </label>
      <div>
        <input
          type="checkbox"
          id="isOnline"
          name="isOnline"
          checked={formData.isOnline}
          onChange={(event) => {
            setFormData({ ...formData, isOnline: event.target.checked });
            // setIsOnline(event.target.checked);
          }}
        />
        <label htmlFor="isOnline" className={styles.label}>
          This is an online/remote event.
        </label>
      </div>
      {formData.isOnline ? (
        <>
          <label htmlFor="link" className={styles.label}>
            Link for Online Event
          </label>
          <input
            type="text"
            id="link"
            name="link"
            className={styles.textInput}
            value={formData.link}
            onChange={(event) => {
              //when the user begins typing, remove the required class from the field
              event.target.classList.remove(styles.required);
              setFormData({ ...formData, link: event.target.value });
            }}
          />
        </>
      ) : (
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
                  className={styles.textInput}
                  id="stateOrProvince"
                  name="stateOrProvince"
                  value={formData.stateOrProvince}
                  onChange={(e) => {
                    e.target.classList.remove(styles.required);
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
                  className={styles.textInput}
                  onChange={(e) => {
                    e.target.classList.remove(styles.required);
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
                  setFormData({ ...formData, postalCode: event.target.value });
                }}
              />
            </div>
          </div>
          <br />
          <label htmlFor="country" className={styles.label}>
            Country*
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
        </>
      )}
      <br />
      <label htmlFor="ticketsLink" className={styles.label}>
        Link to Purchase Tickets
      </label>
      <input
        type="text"
        name="ticketsLink"
        id="ticketsLink"
        className={styles.textInput}
        value={formData.ticketsLink}
        onChange={(event) => {
          setFormData({ ...formData, ticketsLink: event.target.value });
        }}
      />
      <br />
      <label htmlFor="ticketPrice" className={styles.label}>
        Ticket price/pricerange
      </label>
      <input
        type="text"
        name="ticketPrice"
        id="ticketPrice"
        className={styles.textInput}
        value={formData.ticketPrice}
        onChange={(event) => {
          //when the user begins typing, remove the required class from the field
          event.target.classList.remove(styles.required);
          setFormData({ ...formData, ticketPrice: event.target.value });
        }}
      />
      <br />
      <div>
        <input
          type="checkbox"
          id="isPublic"
          name="isPublic"
          checked={formData.isPublic}
          onChange={(event) => {
            setFormData({ ...formData, isPublic: event.target.checked });
          }}
        />
        <label htmlFor="isOnline" className={styles.label}>
          This is a public event. (Other users will be able to see it and search
          for it).
        </label>
      </div>
      <div>
        <label htmlFor="color" className={styles.label}>
          Select a color to use to display the event on the calendar:
        </label>
        <input
          type="color"
          value={formData.color}
          onChange={(e) => {
            setFormData({ ...formData, color: e.target.value });
          }}
        />
      </div>
      <p className={styles.errorMessage}>{error}</p>
      <div className={styles.btnRow}>
        <button onClick={closeSelf} className={styles.cancelBtn}>
          Cancel
        </button>
        <button
          className={styles.saveBtn}
          onClick={async (e) => {
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
            if (!formData.ticketPrice.length > 0)
              incompleteFields.push("ticketPrice");
            if (!formData.isOnline) {
              if (!formData.venueName.length > 0)
                incompleteFields.push("venueName");
              if (!formData.streetAddressLine1.length > 0)
                incompleteFields.push("streetAddressLine1");
              if (!formData.city.length > 0) incompleteFields.push("city");
              if (!formData.stateOrProvince.length > 0)
                incompleteFields.push("stateOrProvince");
              if (!formData.postalCode.length > 0)
                incompleteFields.push("postalCode");
              if (!formData.country.length > 0)
                incompleteFields.push("country");
            } else if (!formData.link.length > 0) {
              incompleteFields.push("link");
            }
            if (incompleteFields.length > 0) {
              for (const field of incompleteFields) {
                document.getElementById(field).classList.add(styles.required);
              }
              setError("Please complete all of the required fields.");
              return;
            }
            //check that the links are valid
            let linksFormatCheckPassed = true;
            if (
              formData.link.length > 0 &&
              !formData.link.match(
                /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
              )
            ) {
              document.getElementById("link").classList.add(styles.required);
              linksFormatCheckPassed = false;
            }
            if (
              formData.ticketsLink.length > 0 &&
              !formData.ticketsLink.match(
                /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
              )
            ) {
              document
                .getElementById("ticketsLink")
                .classList.add(styles.required);
              linksFormatCheckPassed = false;
            }
            if (!linksFormatCheckPassed) {
              setError(
                "Please ensure that the links you have entered constitute valid urls."
              );
              return;
            }
            //check that the links are safe
            const linksToCheck = [];
            if (formData.link.length > 0) linksToCheck.push(formData.link);
            if (formData.ticketsLink.length > 0)
              linksToCheck.push(formData.ticketsLink);
            if (linksToCheck.length > 0) {
              try {
                await checkUris(linksToCheck);
              } catch (e) {
                if (e.threats) {
                  if (e.threats.includes(formData.link)) {
                    document
                      .getElementById("link")
                      .classList.add(styles.required);
                  }
                  if (e.threats.includes(formData.ticketsLink)) {
                    document
                      .getElementById("ticketsLink")
                      .classList.add(styles.required);
                  }
                  setError(
                    `Safety issues were detected in the following links: ${e.threats.join(
                      " "
                    )}. Please remove these links and try again.`
                  );
                  return;
                } else {
                  setError(
                    "Could not verify the safety of the provided links at this time. Please try again later."
                  );
                  return;
                }
              }
            }
            //create a unique id
            const id = uuidv4();
            //create a datetime object for each timeslot
            //sort them according to UTC year, month, date, time
            let UTCtimes = [];
            const timesCb = (t) => {
              const hour = t.slice(0, 2);
              const minute = t.slice(2);
              UTCtimes.push(
                DateTime.fromObject(
                  { year, month, day: date, hour, minute },
                  { zone: tz }
                ).toUTC()
              );
            };
            iterateThroughTimes(startTime, endTime, timesCb);
            let eventStart = UTCtimes[0].toISO();
            let eventEnd = UTCtimes[UTCtimes.length - 1]
              .plus({ minutes: 15 })
              .toISO(); //must increment the end time by 15 minutes so it reflects the end time not the last timeslot filled
            let aggregateUpdateObj = {};
            for (const dt of UTCtimes) {
              let updatedCalendarObj = {};
              const { year, month, day, hour, minute } = dt;
              let paddedHour = hour.toString();
              let paddedMinutes = minute.toString();
              if (paddedHour.length < 2) paddedHour = "0".concat(paddedHour);
              if (paddedMinutes.length < 2)
                paddedMinutes = "0".concat(paddedMinutes);
              const time = paddedHour.concat(paddedMinutes);
              //check that the timeslots are all open
              if (
                user.calendar[year] &&
                user.calendar[year][month] &&
                user.calendar[year][month][day] &&
                user.calendar[year][month][day][time] &&
                user.calendar[year][month][day][time].event
              ) {
                setError("Please select from unoccupied time slots.");
                return;
              }
              updatedCalendarObj = {
                [year]: {
                  [month]: {
                    [day]: {
                      [time]: {
                        event: {
                          ...formData,
                          startTime: eventStart,
                          endTime: eventEnd,
                          _id: id,
                        },
                      },
                    },
                  },
                },
              };
              updatedCalendarObj = mergeDeep(user.calendar, updatedCalendarObj);
              aggregateUpdateObj = mergeDeep(
                aggregateUpdateObj,
                updatedCalendarObj
              );
            }
            let lat = "";
            let lng = "";
            //if the event is not online, get the coordinates
            if (!formData.isOnline) {
              try {
                const coordinates = await geocodeRequest({
                  streetAddressLine1: formData.streetAddressLine1,
                  streetAddressLine2: formData.streetAddressLine2,
                  city: formData.city,
                  stateOrProvince: formData.stateOrProvince,
                  postalCode: formData.postalCode,
                  country: formData.country,
                });
                if (coordinates.lat && coordinates.lng) {
                  lat = coordinates.lat;
                  lng = coordinates.lng;
                }
              } catch (e) {
                console.log(e);
              }
            }
            onCreateEvent(
              {
                ...formData,
                startTime: eventStart,
                endTime: eventEnd,
                lat,
                lng,
                _id: id,
              },
              photo
            )
              .then((event) => {
                setUser({
                  ...user,
                  calendar: aggregateUpdateObj,
                  events: [...user.events, event].sort((a, b) => {
                    return new Date(a.startTime) - new Date(b.startTime);
                  }),
                });
                closeSelf();
              })
              .catch((e) => {
                if (
                  e.response &&
                  e.response.status &&
                  e.response.status === 400
                ) {
                  setError(
                    "⚠️ WARNING! We have detected malware in the photo you've attempted to upload. You may want to scan your local disk for malware. Please proceed without the file."
                  );
                } else
                  setError(
                    "There was a problem creating the event at this time. Please try again later. If the problem persists, please notify us via the contact us page or by email."
                  );
              });
          }}
        >
          Save Event
        </button>
      </div>
    </div>
  );
};
