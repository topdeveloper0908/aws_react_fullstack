import React, { useRef, useState, useContext } from "react";
import jstz from "jstz";
import { AuthenticationContext } from "../../../../../services/authentication/authentication.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { defineWeek, timezones } from "../utils";
import { EventRequest } from "../event-request/EventRequest.component";
import { OtherUserEventView } from "../event-view/OtherUserEventView.component";
import styles from "./week-view-other-user.module.css";

export const WeekViewOtherUser = ({ startDate, user }) => {
  const { user: authenticatedUser, isAuthenticated } = useContext(
    AuthenticationContext
  );

  const sDate = useRef(startDate);
  const hasScrolled = useRef(false);
  const timezone = jstz.determine();
  const tz = useRef(timezone.name());

  //week defaults to sDate but can be redefined by calling setWeek(defineWeek(newsDate))
  const [week, setWeek] = useState(
    defineWeek(sDate.current, user.calendar, tz.current, true)
  );

  const mouseDown = useRef(false);
  const selectedEvent = useRef(null);
  const selectedTimes = useRef([]);
  const [refreshes, setRefreshes] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const onMDown = (year, month, date, time) => {
    if (!mouseDown.current && !showModal && year && month && date && time) {
      mouseDown.current = true;
      if (week.years[year][month][date].timeslots[time].event) {
        selectedEvent.current =
          week.years[year][month][date].timeslots[time].event;
      }
      selectedTimes.current = [{ year, month, date, time }];
      setRefreshes(refreshes + 1);
      return false;
    }
  };

  const onMOver = (year, month, date, time) => {
    if (mouseDown.current && year && month && date && time) {
      if (selectedTimes.current[0].date === date) {
        if (week.years[year][month][date].timeslots[time].event) {
          selectedEvent.current =
            week.years[year][month][date].timeslots[time].event;
        }
        selectedTimes.current = [
          ...selectedTimes.current,
          { year, month, date, time },
        ];
        setRefreshes(refreshes + 1);
      }
      return false;
    }
  };

  document.addEventListener("mouseup", () => {
    mouseDown.current = false;
    if (selectedTimes.current.length > 0) {
      if (!showModal) {
        setShowModal(true);
        if (!hasScrolled.current) {
          const scrollModifier = selectedEvent.current ? -100 : 750;
          window.scroll(
            0,
            document.getElementById("shadowModal").getBoundingClientRect().top -
              document.getElementsByTagName("body")[0].getBoundingClientRect()
                .top -
              scrollModifier
          );
          hasScrolled.current = true;
        }
      }
    }
  });

  const isTimeSelected = (date, time) => {
    let returnValue = false;
    selectedTimes.current.forEach((dt) => {
      if (dt.date === date && dt.time === time) returnValue = true;
    });
    return returnValue;
  };

  return (
    <div className={styles.outerCalendarContainer} id="calendar">
      <div className={styles.shadowModalContainer}>
        <div className={styles.shadowModal} id="shadowModal"></div>
      </div>
      <div>
        <h2 className={styles.heading}>
          {week.start !== week.end ? `${week.start} - ${week.end}` : week.start}
        </h2>
        <select
          className={styles.dateTzInput}
          value={tz.current}
          onChange={(event) => {
            tz.current = event.target.value;
            setWeek(
              defineWeek(sDate.current, user.calendar, event.target.value, true)
            );
          }}
        >
          {timezones.map((zone) => {
            return <option value={zone}>{zone}</option>;
          })}
        </select>
        <input
          className={styles.dateTzInput}
          type="date"
          value={sDate.current}
          onChange={(event) => {
            //if the year would be longer than 4 digits, prevent the value from changing
            if (event.target.value.length > 10)
              event.target.value = sDate.current;
            //if the new value is an invalid date or NaN, prevent it from changing
            if (
              new Date(event.target.value) === "Invalid Date" ||
              isNaN(new Date(event.target.value))
            ) {
              event.target.value = sDate.current;
            }
            sDate.current = event.target.value;
            setWeek(defineWeek(sDate.current, user.calendar, tz.current, true));
          }}
        />
        {isAuthenticated && authenticatedUser && (
          <button
            className="btn"
            onClick={() => {
              setShowModal(true);
              selectedTimes.current = [
                { year: "", month: "", date: "", time: "" },
              ];
              if (!hasScrolled.current) {
                window.scroll(
                  0,
                  document.getElementById("shadowModal").getBoundingClientRect()
                    .top -
                    document
                      .getElementsByTagName("body")[0]
                      .getBoundingClientRect().top -
                    300
                );
                hasScrolled.current = true;
              }
            }}
          >
            Request to Book
          </button>
        )}
      </div>
      <div className={styles.weekViewContainer}>
        <div className={styles.column}>
          <div className={styles.columnHeader}></div>
          <div className={styles.timeBlock}>12:00 AM</div>
          <div className={styles.timeBlock}>1:00 AM</div>
          <div className={styles.timeBlock}>2:00 AM</div>
          <div className={styles.timeBlock}>3:00 AM</div>
          <div className={styles.timeBlock}>4:00 AM</div>
          <div className={styles.timeBlock}>5:00 AM</div>
          <div className={styles.timeBlock}>6:00 AM</div>
          <div className={styles.timeBlock}>7:00 AM</div>
          <div className={styles.timeBlock}>8:00 AM</div>
          <div className={styles.timeBlock}>9:00 AM</div>
          <div className={styles.timeBlock}>10:00 AM</div>
          <div className={styles.timeBlock}>11:00 AM</div>
          <div className={styles.timeBlock}>12:00 PM</div>
          <div className={styles.timeBlock}>1:00 PM</div>
          <div className={styles.timeBlock}>2:00 PM</div>
          <div className={styles.timeBlock}>3:00 PM</div>
          <div className={styles.timeBlock}>4:00 PM</div>
          <div className={styles.timeBlock}>5:00 PM</div>
          <div className={styles.timeBlock}>6:00 PM</div>
          <div className={styles.timeBlock}>7:00 PM</div>
          <div className={styles.timeBlock}>8:00 PM</div>
          <div className={styles.timeBlock}>9:00 PM</div>
          <div className={styles.timeBlock}>10:00 PM</div>
          <div className={styles.timeBlock}>11:00 PM</div>
        </div>
        {(() => {
          const jsx = [];
          const w = week;
          const years = Object.keys(w.years);
          years.forEach((year) => {
            const months = Object.keys(w.years[year]);
            months.forEach((month) => {
              const dates = Object.keys(w.years[year][month]);
              dates.forEach((date, i) => {
                const d = w.years[year][month][date];
                const times = Object.keys(
                  w.years[year][month][date].timeslots
                ).sort();
                jsx.push(
                  <div className={styles.column}>
                    <div className={styles.columnHeader}>
                      <h3>{d.day}</h3>
                      <p>{dates[i]}</p>
                    </div>
                    {times.map((t, i) => {
                      return (
                        <div
                          style={{
                            backgroundColor: w.years[year][month][date]
                              .timeslots[t].event
                              ? w.years[year][month][date].timeslots[t].event
                                  .color || "#008080"
                              : "transparent",
                          }}
                          className={`${styles.timeslot} ${
                            isTimeSelected(date, t) ? styles.selected : ""
                          }`}
                          onMouseDown={() => {
                            onMDown(year, month, date, t);
                          }}
                          onMouseOver={() => {
                            onMOver(year, month, date, t);
                          }}
                        ></div>
                      );
                    })}
                  </div>
                );
              });
            });
          });
          return jsx;
        })()}
      </div>

      <div
        id="modalContainer"
        className={styles.modalContainer}
        style={{ display: showModal ? "flex" : "none" }}
        onClick={(event) => {
          if (event.target.id === "modalContainer") {
            selectedTimes.current = [];
            setShowModal(false);
            hasScrolled.current = false;
            selectedEvent.current = null;
          }
        }}
      >
        {showModal &&
          selectedTimes.current.length > 0 &&
          ((!isAuthenticated && !authenticatedUser) ||
          (!authenticatedUser.blockedUsers.includes(user._id) &&
            !authenticatedUser.blockedByUsers.includes(user._id)) ? (
            selectedEvent.current ? (
              <OtherUserEventView
                event={selectedEvent.current}
                tz={tz.current}
                closeSelf={() => {
                  setShowModal(false);
                  selectedTimes.current = [];
                  hasScrolled.current = false;
                }}
              />
            ) : (
              isAuthenticated &&
              authenticatedUser && (
                <EventRequest
                  tz={tz.current}
                  selectedTimes={selectedTimes.current}
                  closeSelf={() => {
                    setShowModal(false);
                    selectedTimes.current = [];
                    setRefreshes(refreshes + 1);
                    hasScrolled.current = false;
                  }}
                  recipientID={user._id}
                  recipientName={user.displayName}
                />
              )
            )
          ) : (
            <div className={styles.modal}>
              <div className={styles.closeBtnContainer}>
                <button
                  onClick={() => {
                    setShowModal(false);
                    selectedTimes.current = [];
                    setRefreshes(refreshes + 1);
                    hasScrolled.current = false;
                  }}
                  className={styles.closeBtn}
                >
                  <FontAwesomeIcon icon={faTimes} color="white" size="2x" />
                </button>
              </div>
              <h2>
                Interaction with this users is currently blocked. If you
                mistakenly blocked them, you may unblock them at the top of this
                page.
              </h2>
            </div>
          ))}
      </div>
    </div>
  );
};
