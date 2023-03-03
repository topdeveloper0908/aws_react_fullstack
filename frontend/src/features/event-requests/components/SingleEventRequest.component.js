import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { Link } from "react-router-dom";
import styles from "./single-event-request.module.css";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { CalendarContext } from "../../../services/calendar/calendar.context";
import { updateEventReqRequest } from "../../../services/calendar/calendar.service";
import { ContentBox } from "../../../components/content-box/ContentBox.component";
import { getShortTZ, eventTimesToLocalTZ } from "../../../utils/calendar-utils";
import { DateTime } from "luxon";
import jstz from "jstz";
import { TimeSelect } from "../../profiles/components/calendar/TimeSelect/TimeSelect.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";

export const SingleEventRequest = ({
  eventRequestID,
  setParentSelectedRequest,
}) => {
  const { user, eventRequests, setEventRequests, onEventReqAction } =
    useContext(AuthenticationContext);

  const { setPrefilledEventData } = useContext(CalendarContext);

  const eventRequest = eventRequests.find((req) => {
    return req._id === eventRequestID;
  });

  const history = useHistory();

  const [acceptDeclineError, setAcceptDeclineError] = useState("");
  const [offerCreateError, setOfferCreateError] = useState("");

  function onDecline() {
    let fieldValuePairs = [
      {
        field: "declined",
        value: true,
      },
    ];
    if (user._id === eventRequest.senderID) {
      fieldValuePairs.push({
        field: "readByRecipient",
        value: false,
      });
    } else if (user._id === eventRequest.recipientID) {
      fieldValuePairs.push({
        field: "readBySender",
        value: false,
      });
    }
    updateEventReqRequest(eventRequest._id, fieldValuePairs)
      .then(() => {
        const otherPartyID =
          eventRequest.senderID !== user._id
            ? eventRequest.senderID
            : eventRequest.recipientID;
        onEventReqAction(otherPartyID)
          .then(() => {
            return;
          })
          .catch((e) => {
            setAcceptDeclineError(
              "Could not decline the request. Interaction with this user may be blocked."
            );
          });
      })
      .catch((e) => {
        setAcceptDeclineError(
          "Could not decline the request. Interaction with this user may be blocked."
        );
      });
  }

  function onAccept() {
    //accept option will only be available for the last offer made
    const offerToAccept = eventRequest.offers[eventRequest.offers.length - 1];
    let fieldValuePairs = [];
    if (user._id === eventRequest.senderID) {
      fieldValuePairs.push({
        field: "readByRecipient",
        value: false,
      });
    } else if (user._id === eventRequest.recipientID) {
      fieldValuePairs.push({
        field: "readBySender",
        value: false,
      });
    }
    fieldValuePairs.push({
      field: "acceptedOffer",
      value: JSON.stringify({
        startTime: offerToAccept.startTime,
        endTime: offerToAccept.endTime,
        pay: offerToAccept.pay,
      }),
    });
    updateEventReqRequest(eventRequest._id, fieldValuePairs)
      .then(() => {
        const otherPartyID =
          eventRequest.senderID !== user._id
            ? eventRequest.senderID
            : eventRequest.recipientID;
        onEventReqAction(otherPartyID)
          .then(() => {
            return;
          })
          .catch((e) => {
            setAcceptDeclineError(
              "Could not accept the request. Interaction with this user may be blocked."
            );
          });
      })
      .catch((e) => {
        setAcceptDeclineError(
          "Could not accept the request. Interaction with this user may be blocked."
        );
      });
  }

  function onCreateOffer(objectToSend) {
    let fieldValuePairs = [];
    if (user._id === eventRequest.senderID) {
      fieldValuePairs.push({
        field: "readByRecipient",
        value: false,
      });
    } else if (user._id === eventRequest.recipientID) {
      fieldValuePairs.push({
        field: "readBySender",
        value: false,
      });
    }
    fieldValuePairs.push({
      field: "offers",
      value: JSON.stringify(objectToSend),
    });
    updateEventReqRequest(eventRequest._id, fieldValuePairs)
      .then(() => {
        const otherPartyID =
          eventRequest.senderID !== user._id
            ? eventRequest.senderID
            : eventRequest.recipientID;
        onEventReqAction(otherPartyID)
          .then(() => {
            setShowCounterOfferForm(false);
          })
          .catch((e) => {
            setOfferCreateError(
              "Problem creating offer. Interaction with this user may be blocked."
            );
          });
      })
      .catch((e) => {
        setOfferCreateError(
          "Problem creating offer. Interaction with this user may be blocked."
        );
      });
  }

  const tz = jstz.determine().name();
  let defaultStartDT, defaultEndDT;

  //set default start and end dates to last offer
  if (eventRequest.counterOffer) {
    defaultStartDT = DateTime.fromISO(
      eventRequest.counterOffer.startTime
    ).setZone(tz);
    defaultEndDT = DateTime.fromISO(eventRequest.counterOffer.endTime).setZone(
      tz
    );
  } else {
    defaultStartDT = DateTime.fromISO(eventRequest.offers[0].startTime).setZone(
      tz
    );
    defaultEndDT = DateTime.fromISO(eventRequest.offers[0].endTime).setZone(tz);
  }

  //states for offer editor
  const [showCounterOfferForm, setShowCounterOfferForm] = useState(false);
  const [startYear, setStartYear] = useState(defaultStartDT.year); //create states to house year, month and date
  const [startMonth, setStartMonth] = useState(defaultStartDT.month);
  const [startDate, setStartDate] = useState(defaultStartDT.day);
  const [endYear, setEndYear] = useState(defaultEndDT.year);
  const [endMonth, setEndMonth] = useState(defaultEndDT.month);
  const [endDate, setEndDate] = useState(defaultEndDT.day);
  const [rerenders, setRerenders] = useState(0);

  //get the hours to default the editor's time fields to
  let startHour = defaultStartDT.hour.toString();
  let endHour = defaultEndDT.hour.toString();
  let startMin = defaultStartDT.minute.toString();
  let endMin = defaultEndDT.minute;

  //reduce the end time by 15 minutes because it is saved in the event object as the end time not the last occupied time slot
  endMin -= 15;
  if (endMin === -15) {
    endMin = 45;
    endHour--;
  }
  endMin = endMin.toString();
  endHour = endHour.toString();
  if (startHour.length < 2) startHour = "0".concat(startHour);
  if (endHour.length < 2) endHour = "0".concat(endHour);
  if (startMin.length < 2) startMin = "0".concat(startMin);
  if (endMin.length < 2) endMin = "0".concat(endMin);
  const defaultStartTime = `${startHour}${startMin}`;
  const defaultEndTime = `${endHour}${endMin}`;

  //finally set the default start and end times for the editor
  const [startTime, setStartTime] = useState(defaultStartTime);
  const [endTime, setEndTime] = useState(defaultEndTime);

  //error messaging for setting dates
  const [dateError, setDateError] = useState("");

  //this is the form data that will be submitted when a new offer is made, plus proposed start and end times
  const [formData, setFormData] = useState({
    proposedPay: "",
    message: "",
  });

  useEffect(() => {
    //if the eventRequest hasn't been read, update it. do this when eventRequests change so that
    //when a new message comes through while the user has the window open, it doesn't add a notification
    //first, determine which fieldValuePairs to use in update
    let fieldValuePairs;
    if (eventRequest.senderID === user._id) {
      fieldValuePairs = [{ field: "readBySender", value: true }];
    } else if (eventRequest.recipientID === user._id) {
      fieldValuePairs = [{ field: "readByRecipient", value: true }];
    }
    //only update the fields if they are not equal to what is currently stored in the database
    if (eventRequest[fieldValuePairs[0].field] !== fieldValuePairs[0].value) {
      updateEventReqRequest(eventRequest._id, fieldValuePairs)
        .then(() => {
          let filteredEventRequests = eventRequests.filter((r) => {
            return r._id !== eventRequest._id;
          });
          filteredEventRequests.push({
            ...eventRequest,
            [fieldValuePairs[0].field]: [fieldValuePairs[0].value],
          });
          setEventRequests(filteredEventRequests);
        })
        .catch((e) => {
          console.log(e);
        });
    }
    //finally scroll to the bottom of the page
    window.scrollTo(0, document.body.scrollHeight);
  }, []);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [eventRequests]);

  //determine how to display the from and to fields
  const from_name =
    user._id === eventRequest.senderID
      ? user.displayName
      : eventRequest.sender[0].displayName;
  const to_name =
    user._id === eventRequest.recipientID
      ? user.displayName
      : eventRequest.recipient[0].displayName;
  const link = {
    type: user._id === eventRequest.senderID ? "to" : "from", //if you are the sender, TO will link to the other user's profile, otherwise, vice versa
    address:
      "/user?user=" +
      (user._id === eventRequest.senderID
        ? eventRequest.recipient[0].profileUrl
        : eventRequest.sender[0].profileUrl),
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerUpperRow}>
            <div className={styles.headerItem}>
              <small className={styles.caption}>
                <i>Event Title</i>
              </small>
              <h1 className={styles.heading}>{eventRequest.title}</h1>
            </div>
            <div className={styles.headerItem}>
              <small className={styles.caption}>
                <i>Participants</i>
              </small>
              <p className={styles.text}>
                FROM:{" "}
                {link.type === "from" ? (
                  <Link to={link.address} className={styles.link}>
                    {from_name}
                  </Link>
                ) : (
                  from_name
                )}
              </p>
              <p className={styles.text}>
                TO:{" "}
                {link.type === "to" ? (
                  <Link to={link.address} className={styles.link}>
                    {to_name}
                  </Link>
                ) : (
                  to_name
                )}
              </p>
            </div>
            <div className={styles.headerItem}>
              {eventRequest.isOnline ? (
                <p className={styles.text}>
                  This event request is for an online event.
                </p>
              ) : (
                <>
                  <small className={styles.caption}>
                    <i>Proposed location:</i>
                  </small>
                  <p className={styles.text}>{eventRequest.venueName}</p>
                  <p className={styles.text}>
                    {eventRequest.streetAddressLine1}, {eventRequest.city},{" "}
                    {eventRequest.stateOrProvince &&
                      `${eventRequest.stateOrProvince} `}
                    {eventRequest.postalCode}
                  </p>
                  <p className={styles.text}>
                    {eventRequest.streetAddressLine2}
                  </p>
                  <p className={styles.text}></p>
                  <p className={styles.text}>{eventRequest.country}</p>
                </>
              )}
            </div>
            <div className={styles.headerItem}>
              {eventRequest.declined && (
                <p className={styles.text}>
                  ❌ This event request was declined.
                </p>
              )}
              {eventRequest.acceptedOffer && (
                <>
                  <p className={styles.text} style={{ marginBottom: "8px" }}>
                    ✅ This event request was accepted!
                  </p>
                  <HashLink
                    style={{
                      display: "block",
                      width: "fit-content",
                      textDecoration: "none",
                    }}
                    className="btn-save"
                    onClick={() => {
                      const dataToPrefill = {
                        startTime: eventRequest.acceptedOffer.startTime,
                        endTime: eventRequest.acceptedOffer.endTime,
                        title: eventRequest.title,
                        description: eventRequest.description,
                        isOnline: eventRequest.isOnline,
                        venueName: eventRequest.venueName,
                        streetAddressLine1: eventRequest.streetAddressLine1,
                        streetAddressLine2: eventRequest.streetAddressLine2,
                        city: eventRequest.city,
                        stateOrProvince: eventRequest.stateOrProvince,
                        postalCode: eventRequest.postalCode,
                        country: eventRequest.country,
                      };
                      setPrefilledEventData(dataToPrefill);
                    }}
                    to="/profile#calendar"
                  >
                    Add to Calendar
                  </HashLink>
                </>
              )}
            </div>
          </div>
        </header>
      </div>
      {eventRequest.offers.map((offer, index) => {
        return (
          <>
            <div
              className={(() => {
                //there are four possible classes: messageSent, messageReceived, lastMessageSent, lastMessageReceived
                if (index === eventRequest.offers.length - 1) {
                  if (offer.senderID === user._id) {
                    return styles.lastMessageSent;
                  } else return styles.lastMessageReceived;
                } else {
                  if (offer.senderID === user._id) {
                    return styles.messageSent;
                  } else return styles.messageReceived;
                }
              })()}
            >
              {
                //return a thumbnail of the user if the user was the last one to send a message
                index === eventRequest.offers.length - 1 &&
                  offer.senderID === user._id && (
                    <div
                      style={{
                        backgroundImage: `url(${user.profilePicUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "50%",
                        height: "50px",
                        width: "50px",
                        position: "absolute",
                        left: "-60px",
                        bottom: "0px",
                        border: "3px solid white",
                      }}
                    ></div>
                  )
              }
              {
                //return a thumbnail of the other participant if the user was the last one to receive a message
                index === eventRequest.offers.length - 1 &&
                  offer.recipientID === user._id && (
                    <div
                      style={{
                        backgroundImage: `url(${
                          user._id !== eventRequest.senderID
                            ? eventRequest.sender[0].profilePicUrl
                            : eventRequest.recipient[0].profilePicUrl
                        })`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "50%",
                        height: "50px",
                        width: "50px",
                        position: "absolute",
                        right: "-60px",
                        bottom: "0px",
                        border: "3px solid white",
                      }}
                    ></div>
                  )
              }
              <p className={styles.messageText}>{offer.message}</p>
              <small>Proposed Time & Date</small>
              <p className={styles.messageText}>
                {" "}
                {eventTimesToLocalTZ(tz, offer.startTime, offer.endTime)}{" "}
                {getShortTZ(tz)}
              </p>
              <small>Proposed Pay</small>
              <p className={styles.messageText}>{offer.pay}</p>
              {!eventRequest.declined &&
                !eventRequest.acceptedOffer &&
                index === eventRequest.offers.length - 1 &&
                offer.recipientID === user._id && (
                  <>
                    <div className={styles.btnRow}>
                      <button className="btn-cancel" onClick={onDecline}>
                        Decline
                      </button>
                      <button
                        className="btn-save"
                        style={{ marginRight: "4px" }}
                        onClick={() => {
                          setShowCounterOfferForm(true);
                        }}
                      >
                        Make Counter Offer
                      </button>
                      <button className="btn-save" onClick={onAccept}>
                        Accept
                      </button>
                    </div>
                    <div className={styles.mobileBtnsContainer}>
                      <button className="btn-cancel" onClick={onDecline}>
                        <FontAwesomeIcon icon={faTimes} color="white" />
                      </button>
                      <button
                        className="btn-save"
                        style={{ marginRight: "4px" }}
                        onClick={() => {
                          setShowCounterOfferForm(true);
                        }}
                      >
                        <FontAwesomeIcon icon={faExchangeAlt} color="white" />
                      </button>
                      <button className="btn-save" onClick={onAccept}>
                        <FontAwesomeIcon icon={faCheck} color="white" />
                      </button>
                    </div>
                    <p className={styles.errorMessage}>{acceptDeclineError}</p>
                  </>
                )}
            </div>
          </>
        );
      })}
      {showCounterOfferForm && (
        <ContentBox titlePosition={"left"} titleText="Make An Offer">
          <label className={styles.text}>Pay</label>
          <input
            type="text"
            className={styles.textInput}
            value={formData.proposedPay}
            onChange={(e) => {
              setFormData({ ...formData, proposedPay: e.target.value });
            }}
            autoFocus={true}
          />
          <h3 className={styles.text}>
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
                    if (paddedDate.length < 2)
                      paddedDate = "0".concat(paddedDate);
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
                    if (paddedDate.length < 2)
                      paddedDate = "0".concat(paddedDate);
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
          <p className={styles.errorMessage}>{dateError}</p>
          <label htmlFor="message" className={styles.text}>
            Message
          </label>
          <textarea
            className={styles.textarea}
            value={formData.message}
            onChange={(e) => {
              setFormData({ ...formData, message: e.target.value });
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginTop: "18px",
            }}
          >
            <button
              className="btn-cancel"
              onClick={() => setShowCounterOfferForm(false)}
            >
              Cancel
            </button>
            <button
              className="btn-save"
              onClick={() => {
                //first construct object to send
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
                ).toISO();
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
                ).toISO();
                if (
                  newStartDt &&
                  newEndDt &&
                  formData.proposedPay &&
                  formData.message
                ) {
                  const objectToSend = {
                    startTime: newStartDt,
                    endTime: newEndDt,
                    pay: formData.proposedPay,
                    message: formData.message,
                    senderID: user._id,
                    recipientID:
                      eventRequest.senderID !== user._id
                        ? eventRequest.senderID
                        : eventRequest.recipientID,
                  };
                  onCreateOffer(objectToSend);
                }
              }}
            >
              Send Offer
            </button>
          </div>
          <p className={styles.errorMessage}>{offerCreateError}</p>
        </ContentBox>
      )}
      <div
        style={{
          position: "fixed",
          bottom: "0",
          left: "0",
        }}
      >
        <button
          onClick={() => {
            setParentSelectedRequest(null);
          }}
          className={"btn"}
          style={{
            marginBottom: "0px",
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="1x" color="white" /> Back to
          Requests
        </button>
      </div>
    </div>
  );
};
