import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "../../../../services/authentication/authentication.context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import styles from "./mod-dashboard.module.css";

export const ModDashboardScreen = () => {
  const { mod, isAuthenticatedMod } = useContext(AuthenticationContext);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("/count_documents")
      .then((res) => {
        setStats(res.data);
      })
      .catch((e) => {
        setError(e.message);
      });
  }, []);

  const [email, setEmail] = useState("");
  const [fname, setFname] = useState("");
  const [promoCodeEmail, setPromoCodeEmail] = useState("");
  const [showModal, setShowModal] = useState(null);

  return stats ? (
    <div className={styles.screen}>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Users</h3>
          <h2 className={styles.largeText}>
            {stats.allUsers} <span className={styles.text}>total users</span>
          </h2>
          <Link
            to="/moddashboard/new-users"
            className={styles.link}
            style={{ color: "yellow" }}
          >
            {stats.newUsers} new user(s)
          </Link>
          <Link
            to="/moddashboard/newly-updated-users"
            className={styles.link}
            style={{ color: "yellow" }}
          >
            {stats.newlyUpdatedUsers} newly updated user(s)
          </Link>
          <Link
            to="/moddashboard/reported-users"
            className={styles.link}
            style={{ color: "#ff6347" }}
          >
            {stats.reportedUsers} reported user(s)
          </Link>
          <Link
            to="/moddashboard/suspended-users"
            className={styles.link}
            style={{ color: "#ff6347" }}
          >
            {stats.suspendedUsers} suspended user(s)
          </Link>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Events</h3>
          <h2 className={styles.largeText}>
            {stats.events} <span className={styles.text}>upcoming events</span>
          </h2>
          <Link
            to="/moddashboard/events"
            className={styles.link}
            style={{ color: "aquamarine" }}
          >
            View All
          </Link>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Account Executives</h3>
          <h2 className={styles.largeText}>
            {stats.accountExecutives}{" "}
            <span className={styles.text}>account executives</span>
          </h2>
          <Link
            to="/moddashboard/account-executives"
            className={styles.link}
            style={{ color: "aquamarine" }}
          >
            View All
          </Link>
        </div>
        {/* <div className={styles.card}>
          <h3 className={styles.cardTitle}>Moderators</h3>
          <h2 className={styles.largeText}>
            {stats.moderators}{" "}
            <span className={styles.text}>active moderators</span>
          </h2>
          <Link
            to="/moddashboard/moderators"
            className={styles.link}
            style={{ color: "aquamarine" }}
          >
            View All
          </Link>
        </div> */}
        {/* <div className={styles.card}>
          <h3 className={styles.cardTitle}>Reports</h3>
          <h2 className={styles.largeText}>
            {stats.allReports} <span className={styles.text}>reports</span>
          </h2>
          <Link
            to="/moddashboard/all-reports"
            className={styles.link}
            style={{ color: "aquamarine" }}
          >
            View All
          </Link>
          <Link
            to="/moddashboard/unresolved-reports"
            className={styles.link}
            style={{ color: "#ff6347" }}
          >
            {stats.unresolvedReports} unresolved reports
          </Link>
          <Link
            to="/moddashboard/resolved-reports"
            className={styles.link}
            style={{ color: "#ff6347" }}
          >
            {stats.resolvedReports} resolved reports
          </Link>
        </div> */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Actions</h3>
          <p
            className={styles.link}
            style={{ color: "yellow", textDecoration: "underline" }}
            onClick={() => {
              setShowModal("account-executive-modal");
            }}
          >
            New Account Exec Sign Up Code
          </p>
          <p
            className={styles.link}
            style={{ color: "yellow", textDecoration: "underline" }}
            onClick={() => {
              setShowModal("promo-code-modal");
            }}
          >
            New Free Membership Code
          </p>
        </div>
      </div>
      {showModal && (
        <div className={styles.modalContainer}>
          <div className={styles.modal}>
            <div className={styles.closeBtnContainer}>
              <button
                onClick={() => {
                  setShowModal(null);
                }}
                className={styles.closeBtn}
              >
                <FontAwesomeIcon icon={faTimes} color="white" size="2x" />
              </button>
            </div>
            {showModal === "account-executive-modal" ? (
              <>
                <h3 className={styles.text}>
                  Send an Account Executive Sign Up Code
                </h3>
                <label htmlFor="email" className={styles.text}>
                  Email
                </label>
                <br />
                <input
                  className="textInput"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <br />
                <button
                  className="btn-save"
                  onClick={async () => {
                    try {
                      await axios.post("/new_account_exec", { email });
                      alert("successfully sent code");
                      setShowModal(false);
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                >
                  Send Code
                </button>
              </>
            ) : (
              <>
                <h3 className={styles.text}>
                  Send a Free Lifetime Membership Code
                </h3>
                <label htmlFor="fname" className={styles.text}>
                  Prospective User First Name
                </label>
                <br />
                <input
                  className="textInput"
                  type="text"
                  value={fname}
                  onChange={(e) => {
                    setFname(e.target.value);
                  }}
                />
                <br />
                <br />
                <label htmlFor="email" className={styles.text}>
                  Prospective User Email
                </label>
                <br />
                <input
                  className="textInput"
                  type="email"
                  value={promoCodeEmail}
                  onChange={(e) => {
                    setPromoCodeEmail(e.target.value);
                  }}
                />
                <br />
                <button
                  className="btn-save"
                  onClick={async () => {
                    try {
                      await axios.post("/new_join_code", {
                        email: promoCodeEmail,
                        fname,
                      });
                      alert("successfully sent code");
                      setShowModal(false);
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                >
                  Send
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
};
