import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styles from "./list-item.module.css";

export const ListItem = ({ item }) => {
  return (
    <Link
      to={(() => {
        switch (item.itemType) {
          case "user":
            return `/user?user=${item.profileUrl}`;
          case "event":
            return `/event?event=${item._id}`;
          case "moderator": //////////////////////////////////HERE
            return "";
          case "report":
            return "";
          default:
            return "";
        }
      })()}
      className={styles.link}
    >
      <li
        className={styles.listItem}
        key={
          item.displayName ||
          item.title ||
          item.name ||
          (item.fname && item.lname && `${item.lname}, ${item.fname}`) ||
          (item.itemType === "report" && `Report # ${item._id}`)
        }
      >
        <span>
          {item.displayName ||
            item.title ||
            item.name ||
            (item.fname && item.lname && `${item.lname}, ${item.fname}`) ||
            (item.itemType === "report" && `Report # ${item._id}`)}
          {item.tags &&
            item.tags.length > 0 &&
            item.tags.map((t) => {
              return <span style={{ color: "lightgray" }}> | {t}</span>;
            })}
          {item.searchitemType === "event" && item.startTime && (
            <span style={{ color: "lightgray" }}>
              {" "}
              |{" "}
              {new Date(item.startTime).toLocaleString("en-US", {
                dateStyle: "full",
                timeStyle: "short",
              })}
            </span>
          )}
        </span>
        <small style={{ display: "block", color: "white" }}>
          {item.type && item.category && `${item.type} | ${item.category}`}
        </small>
        <p>
          {item.itemType === "user" &&
            item.suspended &&
            "❌ This user has been suspended."}
        </p>
        <p>
          {item.itemType === "user" &&
            !item.suspended &&
            item.reported &&
            "⚠️ This user has been reported. Please review the report and resolve it."}
        </p>
      </li>
    </Link>
  );
};
