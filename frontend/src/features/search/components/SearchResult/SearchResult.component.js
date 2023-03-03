import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SearchContext } from "../../../../services/search/search.context";
import styles from "./search-result.module.css";

export const SearchResult = ({ result }) => {
  const { setSelectedResult } = useContext(SearchContext);

  return (
    <li key={result.displayName || result.title || result.name}>
      <span>
        <Link
          to={(() => {
            switch (result.searchResultType) {
              case "user":
                return `/user?user=${result.profileUrl}`;
              case "event":
                return `/event?event=${result._id}`;
              case "product":
                return `/product?product=${result._id}`;
              default:
                return "";
            }
          })()}
          className={styles.link}
          onClick={() => {
            setSelectedResult({
              ...result,
            });
          }}
        >
          {result.displayName || result.title || result.name}
        </Link>
        {result.tags.length > 0 &&
          result.tags.map((t) => {
            return <span style={{ color: "lightgray" }}> | {t}</span>;
          })}
        {result.searchResultType === "event" && result.startTime && (
          <span style={{ color: "lightgray" }}>
            {" "}
            |{" "}
            {new Date(result.startTime).toLocaleString("en-US", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </span>
        )}
      </span>
      <small style={{ display: "block", color: "white" }}>
        {result.type &&
          result.category &&
          `${result.type} | ${result.category}`}
      </small>
      <p className={styles.description}>
        {result.about &&
          result.about.length > 0 &&
          result.about.substring(0, 201)}
      </p>
    </li>
  );
};
