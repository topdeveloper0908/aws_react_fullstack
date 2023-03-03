import React, { useState, useContext } from "react";
import { DateTime, Interval } from "luxon";
import { AuthenticationContext } from "../../../../../services/authentication/authentication.context";
import { CalendarContext } from "../../../../../services/calendar/calendar.context";
import { geocodeRequest } from "../../../../../services/geocoder/geocoder.service";
import { CountryDropdown } from "../../../../../components/country-dropdown/CountryDropdown.component";
import styles from "./event-editor.module.css";
import {
  iterateThroughTimes,
  militaryToStandard,
  getShortTZ,
  min,
  max,
  add15Minutes,
  mergeDeep,
  clearEvent,
} from "../utils";
import { TimeSelect } from "../TimeSelect/TimeSelect.component";

export const EventEditor = ({
  event,
  tz,
  closeSelf,
  closeSelfAndRefreshParent,
}) => {
  const { user, setUser } = useContext(AuthenticationContext);
  const { onUpdateEvent } = useContext(CalendarContext);
  const defaultStartDT = DateTime.fromISO(event.startTime).setZone(tz);
  const defaultEndDT = DateTime.fromISO(event.endTime).setZone(tz);
  const { year: y1, month: m1, day: d1 } = defaultStartDT; // grab the default start year, month, date
  const { year: y2, month: m2, day: d2 } = defaultEndDT; //grab the default end year, month, date
  const [startYear, setStartYear] = useState(y1); //create states to house year, month and date
  const [startMonth, setStartMonth] = useState(m1);
  const [startDate, setStartDate] = useState(d1);
  const [endYear, setEndYear] = useState(y2);
  const [endMonth, setEndMonth] = useState(m2);
  const [endDate, setEndDate] = useState(d2);
  let startHour = defaultStartDT.hour.toString();
  let endHour = defaultEndDT.hour.toString();
  let startMin = defaultStartDT.minute.toString();
  let endMin = defaultEndDT.minute;
  endMin = endMin.toString();
  endHour = endHour.toString();
  if (startHour.length < 2) startHour = "0".concat(startHour);
  if (endHour.length < 2) endHour = "0".concat(endHour);
  if (startMin.length < 2) startMin = "0".concat(startMin);
  if (endMin.length < 2) endMin = "0".concat(endMin);
  const defaultStartTime = `${startHour}${startMin}`;
  const defaultEndTime = `${endHour}${endMin}`;
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);
  const [dateError, setDateError] = useState("");
  const [error, setError] = useState("");

  const [isOnline, setIsOnline] = useState(event.isOnline);
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    isOnline: event.isOnline,
    link: event.link,
    venueName: event.venueName,
    streetAddressLine1: event.streetAddressLine1,
    streetAddressLine2: event.streetAddressLine2,
    city: event.city,
    stateOrProvince: event.stateOrProvince || "AL",
    country: event.country || "United States of America",
    postalCode: event.postalCode,
    ticketPrice: event.ticketPrice,
    ticketsLink: event.ticketsLink,
    color: event.color,
  });

  return (
    <>
      <h2 className={styles.heading}>Edit Event</h2>
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
            <label htmlFor="date">Start Date</label>
            <input
              className="textInput"
              type="date"
              value={(() => {
                let paddedMonth = startMonth.toString();
                let paddedDate = startDate.toString();
                if (paddedMonth.length < 2)
                  paddedMonth = "0".concat(paddedMonth);
                if (paddedDate.length < 2) paddedDate = "0".concat(paddedDate);
                return `${startYear}-${paddedMonth}-${paddedDate}`;
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
                setStartYear(y);
                setStartMonth(m);
                setStartDate(d);
                //if the new value is greater than the end date, set the end date to the start date
                const testStartDate = DateTime.fromISO(e.target.value);
                const testEndDate = DateTime.fromObject({
                  year: endYear,
                  month: endMonth,
                  day: endDate,
                });
                if (testStartDate > testEndDate) {
                  setEndYear(y);
                  setEndMonth(m);
                  setEndDate(d);
                }
                //if the new value is more than one day behind the end date, set the end date to the start date
                if (testEndDate.minus({ day: 2 }) >= testStartDate) {
                  setEndYear(y);
                  setEndMonth(m);
                  setEndDate(d);
                }
              }}
            />
          </div>
          <h3 style={{ padding: 0, margin: "12px", alignSelf: "flex-end" }}>
            {getShortTZ(tz)}
          </h3>
        </div>
        <div className="formRow">
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
            <label htmlFor="date">End Date</label>
            <input
              className="textInput"
              type="date"
              value={(() => {
                let paddedMonth = endMonth.toString();
                let paddedDate = endDate.toString();
                if (paddedMonth.length < 2)
                  paddedMonth = "0".concat(paddedMonth);
                if (paddedDate.length < 2) paddedDate = "0".concat(paddedDate);
                return `${endYear}-${paddedMonth}-${paddedDate}`;
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
                //if the new value is less than the start date, or more than 1 day ahead of the start date, prevent it from changing
                const testEndDate = DateTime.fromISO(e.target.value);
                const testStartDate = DateTime.fromObject({
                  year: startYear,
                  month: startMonth,
                  day: startDate,
                });
                if (testEndDate < testStartDate) {
                  setDateError(
                    "End date must be the same as or later than the start date."
                  );
                  e.preventDefault();
                  return;
                }
                if (testStartDate.plus({ day: 2 }) <= testEndDate) {
                  setDateError(
                    "Please select an end date that is within one day of the start date."
                  );
                  e.preventDefault();
                  return;
                }
                const splitDate = e.target.value.split("-");
                const y = splitDate[0];
                const m = splitDate[1];
                const d = splitDate[2];
                setEndYear(y);
                setEndMonth(m);
                setEndDate(d);
              }}
            />
          </div>
        </div>
      </h3>
      <p>{dateError}</p>
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
      {isOnline ? (
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
        <button onClick={closeSelf} className="btn-cancel">
          Cancel
        </button>
        <button
          className="btn-save"
          onClick={() => {
            //verify that all required fields are complete
            let incompleteFields = [];
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
            //first create a copy of the current user calendar that lacks the event to be updated
            const clearedCalendarObj = clearEvent(
              user.calendar,
              defaultStartDT,
              defaultEndDT
            );
            //now create a datetime object for each new timeslot
            //sort them according to UTC year, month, date, time
            let UTCtimes = [];
            //takes in a day and returns a function for use as a callback in the iterateThroughTimes function
            function timesCb(dt) {
              return function (t) {
                const hour = t.slice(0, 2);
                const minute = t.slice(2);
                UTCtimes.push(
                  DateTime.fromObject(
                    {
                      year: dt.year,
                      month: dt.month,
                      day: dt.day,
                      hour,
                      minute,
                    },
                    {
                      zone: "utc",
                    }
                  )
                );
              };
            }
            //create starting and ending DateTime objects, and then military time strings from those objects
            const newStartDt = DateTime.fromObject(
              {
                year: startYear,
                month: startMonth,
                day: startDate,
                hour: Number(startTime.slice(0, 2)),
                minute: Number(startTime.slice(2)),
              },
              {
                zone: tz,
              }
            ).toUTC();
            const newEndDt = DateTime.fromObject(
              {
                year: endYear,
                month: endMonth,
                day: endDate,
                hour: Number(endTime.slice(0, 2)),
                minute: Number(endTime.slice(2)),
              },
              {
                zone: tz,
              }
            ).toUTC();
            let newStartHour = newStartDt.hour.toString();
            if (newStartHour.length < 2)
              newStartHour = "0".concat(newStartHour);
            let newStartMinute = newStartDt.minute.toString();
            if (newStartMinute.length < 2)
              newStartMinute = "0".concat(newStartMinute);
            const newStartTime = newStartHour.concat(newStartMinute);
            let newEndHour = newEndDt.hour.toString();
            if (newEndHour.length < 2) newEndHour = "0".concat(newEndHour);
            let newEndMinute = newEndDt.minute.toString();
            if (newEndMinute.length < 2)
              newEndMinute = "0".concat(newEndMinute);
            const newEndTime = newEndHour.concat(newEndMinute);
            //now, with new starting/ending DateTimes and times in military time string format, populate the UTC times array
            //find the difference in days between the start time and end time. Round down because decimal values are still part of the same day
            const difference = Interval.fromDateTimes(
              DateTime.fromObject({
                year: newStartDt.year,
                month: newStartDt.month,
                day: newStartDt.day,
                hour: 12,
                minute: 0,
              }),
              DateTime.fromObject({
                year: newEndDt.year,
                month: newEndDt.month,
                day: newEndDt.day,
                hour: 12,
                minute: 0,
              })
            ).length("days");
            //if the start and end times occur on the same day, iterate through one day of times, if not loop through multiple days
            if (difference === 0) {
              iterateThroughTimes(
                newStartTime,
                newEndTime,
                timesCb(newStartDt)
              );
            } else {
              iterateThroughTimes(newStartTime, "2345", timesCb(newStartDt));
              for (let i = 1; i < difference; i++) {
                iterateThroughTimes(
                  "0000",
                  "2345",
                  timesCb(newStartDt.plus({ days: i }))
                );
              }
              iterateThroughTimes("0000", newEndTime, timesCb(newEndDt));
            }
            //unlike in clearEvent(), the last entry in the array doesn't need to be removed as it already corresponds to the last occupied timeslot, not the actual ending time
            //get the new event start and end times in ISO format to save in the event document
            let eventStart = UTCtimes[0].setZone("utc").toISO();
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
                clearedCalendarObj[year] &&
                clearedCalendarObj[year][month] &&
                clearedCalendarObj[year][month][day] &&
                clearedCalendarObj[year][month][day][time] &&
                clearedCalendarObj[year][month][day][time].event
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
                          _id: event.id,
                        },
                      },
                    },
                  },
                },
              };
              updatedCalendarObj = mergeDeep(
                updatedCalendarObj,
                clearedCalendarObj
              );
              aggregateUpdateObj = mergeDeep(
                aggregateUpdateObj,
                updatedCalendarObj
              );
            }
            onUpdateEvent(event._id, {
              ...formData,
              startTime: eventStart,
              endTime: eventEnd,
            })
              .then((updatedEvent) => {
                const updatedEvents = [...user.events].filter((e) => {
                  return e._id !== updatedEvent._id;
                });
                updatedEvents.push(updatedEvent);
                updatedEvents.sort((a, b) => {
                  return new Date(a.startTime) - new Date(b.startTime);
                });
                setUser({
                  ...user,
                  calendar: aggregateUpdateObj,
                  events: updatedEvents,
                });
                closeSelf();
              })
              .catch((e) => {
                console.log(e);
              });
          }}
        >
          Update Event
        </button>
      </div>
    </>
  );
};
