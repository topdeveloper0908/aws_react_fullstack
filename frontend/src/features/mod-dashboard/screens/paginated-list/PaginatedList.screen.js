import React, { useState, useEffect } from "react";
import ScaleLoader from "react-spinners/ScaleLoader";
import { ListItem } from "./components/ListItem.component";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./paginated-list.module.css";

export const PaginatedList = ({ documentType }) => {
  const [paginatedData, setPaginatedData] = useState([]);
  const [pageToShow, setPageToShow] = useState(0);
  const [startPageNum, setStartPageNum] = useState(1);
  const [endPageNum, setEndPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  let title, listItemType;
  switch (documentType) {
    case "new_users":
      title = "New Users";
      listItemType = "user";
      break;
    case "newly_updated_users":
      title = "Newly Updated Users";
      listItemType = "user";
      break;
    case "suspended_users":
      title = "Suspended Users";
      listItemType = "user";
      break;
    case "reported_users":
      title = "Reported Users";
      listItemType = "user";
      break;
    case "events":
      title = "Events";
      listItemType = "event";
      break;
    case "account_executives":
      title = "Account Executives";
      listItemType = "user";
      break;
    case "moderators":
      title = "Moderators";
      listItemType = "moderator";
      break;
    case "all_reports":
      title = "All Reports";
      listItemType = "report";
      break;
    case "unresolved_reports":
      title = "Unresolved Reports";
      listItemType = "report";
      break;
    case "resolved_reports":
      title = "Resolved Reports";
      listItemType = "report";
      break;
    default:
      title = "Unknown Document Type";
  }

  useEffect(() => {
    axios
      .get(`/moderator_docs/${documentType}`)
      .then((res) => {
        const { data } = res;
        const arrayLength = data.length;
        const pages = [];

        for (let i = 0; i < arrayLength; i += 10) {
          const page = data.slice(i, i + 10);
          pages.push(page);
        }

        setIsLoading(false);
        setEndPageNum(Math.min(pages.length, 10));
        setPaginatedData(pages);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
      });
  }, []);

  return (
    <div className={styles.screen}>
      <h1>{title}</h1>
      {isLoading ? (
        <ScaleLoader
          color={"#FFFFFF"}
          loading={true}
          size={40}
          speedMultiplier={0.5}
          style={{ justifySelf: "center" }}
        />
      ) : (
        (() => {
          return paginatedData &&
            paginatedData.length > 0 &&
            paginatedData[pageToShow] ? (
            <ul className={styles.data}>
              {paginatedData[pageToShow].map((d, index) => {
                return <ListItem item={{ ...d, itemType: listItemType }} />;
              })}
            </ul>
          ) : (
            <h2 className={styles.searchSubheading}>No results found</h2>
          );
        })()
      )}
      {paginatedData && paginatedData.length > 1 && (
        <div className={styles.pageNumbers}>
          {(() => {
            let jsx = [];
            //always push the first page to the paginated results
            jsx.push(
              <button
                className={`${styles.pageNumber} ${
                  pageToShow === 0 && styles.pageNumberSelected
                }`}
                onClick={() => {
                  setStartPageNum(1);
                  setEndPageNum(Math.min(paginatedData.length, 10));
                  setPageToShow(0);
                }}
              >
                {1}
              </button>
            );
            //if the startingPageNumber is greater than 2, render an ellipsis
            if (startPageNum > 2) {
              jsx.push(
                <span
                  style={{
                    color: "white",
                    fontFamily: "Noto Sans Display",
                    fontSize: "18px",
                  }}
                >
                  ...
                </span>
              );
            }
            //now loop from the starting page number to the ending page number
            for (let i = startPageNum; i < endPageNum; i++) {
              //if the starting page number is 1, skip the iteration as it has already been added to the array
              if (i === 1) continue;
              //otherwise, push a button to the array
              jsx.push(
                <button
                  className={`${styles.pageNumber} ${
                    pageToShow === i - 1 && styles.pageNumberSelected
                  }`}
                  onClick={() => {
                    //create a range of values
                    let startValue = i - 4;
                    let endValue = i + 4;
                    if (startValue <= 1) {
                      endValue += -startValue + 2;
                      startValue = 1;
                    }
                    if (endValue > paginatedData.length) {
                      let diff = endValue - paginatedData.length;
                      endValue = paginatedData.length;
                      if (startValue > 1) {
                        startValue -= diff;
                        if (startValue < 1) startValue = 1;
                      }
                    }
                    setStartPageNum(startValue);
                    setEndPageNum(endValue);
                    setPageToShow(i - 1);
                  }}
                >
                  {i}
                </button>
              );
            }
            //if the endPageNum is not equal to the length of the results, add an ellipsis
            if (endPageNum !== paginatedData.length) {
              jsx.push(
                <span
                  style={{
                    color: "white",
                    fontFamily: "Noto Sans Display",
                    fontSize: "18px",
                  }}
                >
                  ...
                </span>
              );
            }
            //add the last page
            jsx.push(
              <button
                className={`${styles.pageNumber} ${
                  pageToShow === paginatedData.length - 1 &&
                  styles.pageNumberSelected
                }`}
                onClick={() => {
                  setEndPageNum(paginatedData.length);
                  setStartPageNum(Math.max(paginatedData.length - 8, 1));
                  setPageToShow(paginatedData.length - 1);
                }}
              >
                {paginatedData.length}
              </button>
            );
            return jsx;
          })()}
        </div>
      )}
    </div>
  );
};
