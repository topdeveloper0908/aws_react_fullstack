import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import jstz from "jstz";
import { SearchContext } from "../../../services/search/search.context";
import styles from "./event-view-screen.module.css";
import {
  eventTimesToLocalTZ,
  getShortTZ,
} from "../../profiles/components/calendar/utils";
import { getEvent } from "../../../services/calendar/calendar.service";

export const EventViewScreen = () => {
  const { eventResults } = useContext(SearchContext);
  const [event, setEvent] = useState(null);
  const tz = jstz.determine().name();

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const e = params.get("event");
    getEvent(e)
      .then((res) => {
        setEvent(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className={styles.eventViewScreenContainer}>
      <div className={styles.innerEventView}>
        {event ? (
          <>
            <div
              style={{
                width: "100%",
                height: event.photoUrl ? "300px" : "0px",
                backgroundImage: `url(${event.photoUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
            <div>
              <h1 className={styles.heading}>{event.title}</h1>
              <h2 className={styles.subheading}>
                {eventTimesToLocalTZ(tz, event.startTime, event.endTime)}{" "}
                {getShortTZ(tz)}
              </h2>
              <h2 className={styles.subheading}>
                hosted by{" "}
                <Link
                  to={`/user?user=${event.ownerProfileUrl}`}
                  style={{ color: "yellow" }}
                >
                  {event.ownerName}
                </Link>
              </h2>
              {!event.isOnline && (
                <>
                  <p className={styles.subheading}>
                    {event.streetAddressLine1}
                  </p>
                  <p className={styles.subheading}>
                    {event.streetAddressLine2}
                  </p>
                  <p className={styles.subheading}>
                    {event.city && `${event.city}, `}
                    {event.stateOrProvince && `${event.stateOrProvince}, `}
                    {event.country && `${event.country} `}
                    {event.postalCode}
                  </p>
                </>
              )}
              <p>{event.description}</p>

              {event.isOnline && (
                <>
                  <p>This is an online event:</p>
                  <a href={event.link} className={styles.link}>
                    {event.link}
                  </a>
                </>
              )}
              {event.ticketsLink && (
                <>
                  <p>Link to purchase tickets:</p>
                  <a href={event.ticketsLink} className={styles.link}>
                    {event.ticketsLink}
                  </a>
                </>
              )}
            </div>
          </>
        ) : (
          <h3 className={styles.subheading}>No Event Selected</h3>
        )}
      </div>
    </div>
  );
};
