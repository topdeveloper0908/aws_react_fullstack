import React, { useState, useContext, useEffect } from "react";
import { SearchContext } from "../../../services/search/search.context";
import { SearchForm } from "../components/SearchForm.component";
import { SearchTypeBreadcrumb } from "../components/SearchTypeBreadcrumb/SearchTypeBreadcrumb.component";
import { SearchResult } from "../components/SearchResult/SearchResult.component";
import { Footer } from "../../../components/footer/Footer.component";
import styles from "./search-screen.module.css";
import { paginate } from "../utils";

export const SearchScreen = () => {
  const {
    results,
    creativeResults,
    businessResults,
    eventResults,
    productResults,
    resourceResults,
    searchType,
  } = useContext(SearchContext);
  const [paginatedResults, setPaginatedResults] = useState([]);
  const [pageToShow, setPageToShow] = useState(0);
  const [startPageNum, setStartPageNum] = useState(1);
  const [endPageNum, setEndPageNum] = useState(1);

  useEffect(() => {
    let r;
    switch (searchType) {
      case "Show All":
        r = results;
        break;
      case "Creative":
        r = creativeResults;
        break;
      case "Business":
        r = businessResults;
        break;
      case "Event":
        r = eventResults;
        break;
      case "Resource":
        r = resourceResults;
        break;
      default:
        r = results;
    }
    if (r.length > 10) {
      const paginated = paginate(r);
      setPaginatedResults(paginated);
      setStartPageNum(1);
      setEndPageNum(Math.min(paginated.length, 10));
      setPageToShow(0);
    } else {
      setPaginatedResults([r]);
      setPageToShow(0);
    }
  }, [
    results,
    creativeResults,
    businessResults,
    eventResults,
    resourceResults,
    searchType,
  ]);

  return (
    <>
      <div className={styles.searchScreenContainer}>
        <h1 className={styles.searchHeading}>Search</h1>

        <SearchForm useSearchScreenStyles={true} />
        <SearchTypeBreadcrumb />
        {(() => {
          return paginatedResults &&
            paginatedResults.length > 0 &&
            paginatedResults[pageToShow] ? (
            <ul className={styles.results}>
              {paginatedResults[pageToShow].map((r) => {
                return <SearchResult result={r} />;
              })}
            </ul>
          ) : (
            <h2 className={styles.searchSubheading}>No results found</h2>
          );
        })()}
        {paginatedResults && paginatedResults.length > 1 && (
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
                    setEndPageNum(Math.min(paginatedResults.length, 10));
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
                      if (endValue > paginatedResults.length) {
                        let diff = endValue - paginatedResults.length;
                        endValue = paginatedResults.length;
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
              if (endPageNum !== paginatedResults.length) {
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
                    pageToShow === paginatedResults.length - 1 &&
                    styles.pageNumberSelected
                  }`}
                  onClick={() => {
                    setEndPageNum(paginatedResults.length);
                    setStartPageNum(Math.max(paginatedResults.length - 8, 1));
                    setPageToShow(paginatedResults.length - 1);
                  }}
                >
                  {paginatedResults.length}
                </button>
              );
              return jsx;
            })()}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

SearchScreen.defaultProps = {
  defaultResultType: "all",
};
