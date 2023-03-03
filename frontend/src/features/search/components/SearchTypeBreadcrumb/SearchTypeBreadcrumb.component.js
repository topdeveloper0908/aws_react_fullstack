import React, { useContext } from "react";
import { SearchContext } from "../../../../services/search/search.context";
import styles from "./search-type-breadcrumb.module.css";

export const SearchTypeBreadcrumb = () => {
  const { searchType, setSearchType } = useContext(SearchContext);

  return (
    <nav className={styles.searchTypeBreadcrumb}>
      <button
        className={`${styles.searchTypeBtn} ${
          searchType === "Show All" && styles.selected
        }`}
        onClick={() => {
          setSearchType("Show All");
        }}
      >
        All
      </button>
      <button
        className={`${styles.searchTypeBtn} ${
          searchType === "Creative" && styles.selected
        }`}
        onClick={() => {
          setSearchType("Creative");
        }}
      >
        Creatives
      </button>
      <button
        className={`${styles.searchTypeBtn} ${
          searchType === "Business" && styles.selected
        }`}
        onClick={() => {
          setSearchType("Business");
        }}
      >
        Businesses
      </button>
      <button
        className={`${styles.searchTypeBtn} ${
          searchType === "Event" && styles.selected
        }`}
        onClick={() => {
          setSearchType("Event");
        }}
      >
        Events
      </button>
      <button
        className={`${styles.searchTypeBtn} ${
          searchType === "Resource" && styles.selected
        }`}
        onClick={() => {
          setSearchType("Resource");
        }}
      >
        Resources
      </button>
    </nav>
  );
};
