import React from "react";
import { Link } from "react-router-dom";
import jstz from "jstz";
import hexToHsl from "hex-to-hsl";
import styles from "./events.module.css";
import { eventTimesToLocalTZ, getShortTZ } from "../calendar/utils";

const Event = ({ event, tz }) => {
  const secondaryColor = hexToHsl(event.color)[2] > 40 ? "#121212" : "white";

  return (
    <li>
      <div
        className={styles.titleContainer}
        style={{ backgroundColor: event.color }}
      >
        <Link
          to={`/event?event=${event._id}`}
          className={styles.link}
          style={{ color: secondaryColor }}
        >
          {event.title}
        </Link>
        <p className={styles.title} style={{ color: secondaryColor }}>
          {eventTimesToLocalTZ(tz, event.startTime, event.endTime)}{" "}
          {getShortTZ(tz)}
        </p>
      </div>
      <div
        className={styles.infoContainer}
        style={{ border: `3px solid ${event.color}` }}
      >
        <p className={styles.text}>
          {event.description.substring(0, 151) +
            (event.description.length > 150 ? "..." : "")}
        </p>
        <p className={styles.text}>
          {event.isOnline ? (
            <a
              href={event.link}
              style={{
                fontFamily: "Noto Sans Display",
                fontSize: "18px",
                color: "yellow",
              }}
            >
              {event.link}
            </a>
          ) : (
            <>
              {event.streetAddressLine1} |{" "}
              {event.streetAddressLine2 ? `${event.streetAddressLine2} | ` : ""}
              {event.city}, {event.stateOrProvince} {event.postalCode}{" "}
              {event.country !== "United States of America" && event.country}
            </>
          )}
        </p>
      </div>
    </li>
  );
};

export const Events = ({ events }) => {
  const timezone = jstz.determine().name();

  return (
    <ul className={styles.eventsContainer}>
      {events.map((e) => {
        return <Event event={e} tz={timezone} />;
      })}
    </ul>
  );
};
