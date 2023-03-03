import React, { useState, useContext } from "react";
import { DateTime } from "luxon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { AuthenticationContext } from "../../../../../services/authentication/authentication.context";
import { CalendarContext } from "../../../../../services/calendar/calendar.context";
import styles from "./event-view.module.css";
import { eventTimesToLocalTZ, getShortTZ, clearEvent } from "../utils";
import { EventEditor } from "../event-editor/EventEditor.component";

export const EventView = ({ event, tz, closeSelf }) => {
  const [showDeleteMenu, setShowDeleteMenu] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const { user, setUser } = useContext(AuthenticationContext);
  const { onDeleteEvent } = useContext(CalendarContext);

  return (
    <div className={styles.modal} id="modal">
      <div className={styles.closeBtnContainer}>
        <button onClick={closeSelf} className={styles.closeBtn}>
          <FontAwesomeIcon icon={faTimes} color="white" size="2x" />
        </button>
      </div>
      {!showEditor ? (
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
          {!showDeleteMenu ? (
            <div className={styles.buttonContainer}>
              <button
                className="btn-delete"
                onClick={() => {
                  setShowDeleteMenu(true);
                }}
              >
                <i>Delete</i>
              </button>
              <button
                className="btn"
                onClick={() => {
                  setShowEditor(true);
                }}
              >
                <i>Edit</i>
              </button>
            </div>
          ) : (
            <div className={styles.deleteMenu}>
              <label
                htmlFor="permanentlyDelete"
                className={styles.deleteMenuLabel}
              >
                Type <i>permanently delete</i> to delete the event
              </label>
              <input
                type="text"
                className="textInput"
                name="permanentlyDelete"
                id="permanentlyDelete"
                placeholder="permanently delete"
                onChange={(e) => {
                  if (
                    e.target.value === "permanently delete" &&
                    deleteError.length > 0
                  ) {
                    setDeleteError("");
                  }
                }}
              />
              <div className={styles.buttonContainer}>
                <button
                  className={styles.cancelBtn}
                  onClick={() => {
                    setShowDeleteMenu(false);
                    setDeleteError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn-delete"
                  onClick={() => {
                    const permDeleteInput =
                      document.getElementById("permanentlyDelete");
                    if (permDeleteInput.value === "permanently delete") {
                      //update the user's calendar with the updatedCalendarObj and delete the event
                      onDeleteEvent(event._id)
                        .then(() => {
                          //clear the event from the user's calendar
                          const updatedCalendarObj = clearEvent(
                            user.calendar,
                            event.startTime,
                            event.endTime
                          );
                          const updatedEvents = [...user.events].filter((e) => {
                            return e._id !== event._id;
                          });
                          setUser({
                            ...user,
                            calendar: updatedCalendarObj,
                            events: updatedEvents,
                          });
                          closeSelf();
                        })
                        .catch((e) => {
                          setDeleteError(
                            "There was a problem deleting the event."
                          );
                        });
                    } else {
                      setDeleteError(
                        'Please enter "permanently delete" if you wish to delete this event.'
                      );
                    }
                  }}
                >
                  <i>Delete this event</i>
                </button>
              </div>
              {deleteError.length > 0 && (
                <p className={styles.errorMessage}>{deleteError}</p>
              )}
            </div>
          )}
        </>
      ) : (
        <EventEditor
          tz={tz}
          event={event}
          closeSelf={() => {
            setShowEditor(false);
          }}
        />
      )}
    </div>
  );
};
