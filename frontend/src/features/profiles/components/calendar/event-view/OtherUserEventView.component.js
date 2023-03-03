import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./event-view.module.css";
import { eventTimesToLocalTZ, getShortTZ } from "../utils";

export const OtherUserEventView = ({ event, tz, closeSelf }) => {
  return (
    <div className={styles.modal} id="modal">
      <div className={styles.closeBtnContainer}>
        <button onClick={closeSelf} className={styles.closeBtn}>
          <FontAwesomeIcon icon={faTimes} color="white" size="2x" />
        </button>
      </div>
      {event.isPublic ? (
        <>
          <h2 className={styles.heading}>
            {event.title}
            <p style={{ fontSize: "16px", display: "inline", float: "right" }}>
              {eventTimesToLocalTZ(tz, event.startTime, event.endTime)}{" "}
              {getShortTZ(tz)}
            </p>
          </h2>
          {event.isOnline ? (
            <>
              <small className={styles.annotation}>
                This is an online event.
              </small>
              <p>{event.link}</p>
            </>
          ) : (
            <>
              <p>
                {event.streetAddressLine1} |{" "}
                {event.streetAddressLine2
                  ? `${event.streetAddressLine2} | `
                  : ""}
                {event.city}, {event.state} {event.zip}
              </p>
            </>
          )}
          <hr style={{ width: "100%" }} />
          <small className={styles.annotation}>event description:</small>
          <p>{event.description}</p>
          <small className={styles.annotation}>purchase tickets:</small>
          <p>{event.ticketsLink}</p>
          <small className={styles.annotation}>price of admission:</small>
          <p>{event.ticketPrice}</p>
        </>
      ) : (
        <h2
          className={styles.heading}
          style={{ textAlign: "center", marginBottom: "40px" }}
        >
          The user has blocked this time off as unavailable.
        </h2>
      )}
    </div>
  );
};
