import React, { useRef, useState, useContext, useEffect } from "react";
import jstz from "jstz";
import { AuthenticationContext } from "../../../../../services/authentication/authentication.context";
import { CalendarContext } from "../../../../../services/calendar/calendar.context";
import { SearchContext } from "../../../../../services/search/search.context";
import {
  iterateThroughDays,
  iterateThroughTimes,
  dateToMonthAndYear,
  convertToUTCAndLookUp,
  defineWeek,
  timezones,
} from "../utils";
import { Scheduler } from "../scheduler/Scheduler.component";
import { EventView } from "../event-view/EventView.component";
import styles from "./own-week-view.module.css";

export const OwnWeekView = ({ startDate, isOwnProfile }) => {
  const { user } = useContext(AuthenticationContext);
  const { prefilledEventData, setPrefilledEventData } =
    useContext(CalendarContext);
  const sDate = useRef(startDate);
  const hasScrolled = useRef(false);
  const timezone = jstz.determine();
  const tz = useRef(timezone.name());

  //week defaults to sDate but can be redefined by calling setWeek(defineWeek(newsDate))
  const [week, setWeek] = useState(
    defineWeek(sDate.current, user.calendar, tz.current)
  );

  //redefine the week when the user's calendar changes
  useEffect(() => {
    setWeek(defineWeek(sDate.current, user.calendar, tz.current));
  }, [user.calendar]);

  const mouseDown = useRef(false);
  const selectedEvent = useRef(null);
  const selectedTimes = useRef(
    prefilledEventData ? [{ year: "", month: "", date: "", time: "" }] : []
  );
  const [refreshes, setRefreshes] = useState(0);
  const [showModal, setShowModal] = useState(prefilledEventData ? true : false);

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
        const scrollModifier = selectedEvent.current ? -100 : 300;
        if (!hasScrolled.current) {
          //will have to figure out why this is sticking

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
      <div className={styles.horizontalRow}>
        <h2 className={styles.heading}>
          {week.start !== week.end ? `${week.start} - ${week.end}` : week.start}
        </h2>
        <div className={styles.flexRow}>
          <select
            className={styles.dateTzInput}
            value={tz.current}
            onChange={(event) => {
              tz.current = event.target.value;
              setWeek(defineWeek(sDate.current, user.calendar, tz.current));
            }}
          >
            {timezones.map((zone, index) => {
              return <option value={zone} key={index}>{zone}</option>;
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
              setWeek(defineWeek(sDate.current, user.calendar, tz.current));
            }}
          />
        </div>
      </div>
      <div>
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
          Add An Event
        </button>
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
                          key={i}
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
            setPrefilledEventData(null);
            hasScrolled.current = false;
            selectedEvent.current = null;
          }
        }}
      >
        {showModal &&
          selectedTimes.current.length > 0 &&
          (selectedEvent.current ? (
            <EventView
              event={selectedEvent.current}
              tz={tz.current}
              closeSelf={() => {
                selectedEvent.current = null;
                setShowModal(false);
                setPrefilledEventData(null);
                selectedTimes.current = [];
                hasScrolled.current = false;
              }}
            />
          ) : (
            <Scheduler
              tz={tz.current}
              selectedTimes={selectedTimes.current}
              closeSelf={() => {
                setShowModal(false);
                setPrefilledEventData(null);
                selectedTimes.current = [];
                setRefreshes(refreshes + 1);
                hasScrolled.current = false;
              }}
            />
          ))}
      </div>
    </div>
  );
};
