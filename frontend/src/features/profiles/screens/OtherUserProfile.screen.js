import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { MessagingContext } from "../../../services/messaging/messaging.context";
import { useHistory } from "react-router-dom";
import styles from "./profile.module.css";
import { ContentBox } from "../components/content-box/ContentBox.component";
import { Events } from "../components/events-display/Events.component";
import { WeekViewOtherUser } from "../components/calendar/week-view-other-user/WeekViewOtherUser.component";
import { Thumbnail } from "../components/thumbnail/Thumbnail.component";
import { AudioPlayer } from "../components/audio-player/AudioPlayer.component";
import { getUserByLink } from "../../../services/users/users.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export const OtherUserProfile = () => {
  const {
    user: u,
    onToggleBlockedStatus,
    isAuthenticated,
    onReportUser,
    isAuthenticatedMod,
    mod,
  } = useContext(AuthenticationContext);
  const {
    setParticipantID,
    setParticipantName,
    setParticipantProfilePicUrl,
    setParticipantProfileUrl,
  } = useContext(MessagingContext);
  const [user, setUser] = useState(null);
  const [blockButtonDisabled, setBlockButtonDisabled] = useState(false);
  const [showReportUserModal, setShowReportUserModal] = useState(false);
  const [showSuspendUserModal, setShowSuspendUserModal] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [confirmReportIntent, setConfirmReportIntent] = useState("");
  const [reportError, setReportError] = useState("");
  const [suspendError, setSuspendError] = useState("");
  const [confirmSuspendIntent, setConfirmSuspendIntent] = useState("");
  const [suspended, setSuspended] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const queryString = window.location.search;
    const params = new URLSearchParams(queryString);
    const link = params.get("user");
    if (u && link === u.profileUrl) {
      history.push("/profile");
    } else {
      getUserByLink(link)
        .then((u) => {
          setSuspended(u.suspended);
          setUser(u);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  let upcomingEvents = [];

  if (user && user.events && user.events.length > 0) {
    upcomingEvents = user.events
      .filter((evt) => {
        return new Date(evt.startTime) >= Date.now() && evt.isPublic;
      })
      .slice(0, 5);
  }

  return user ? (
    <div className={styles.profileContainer}>
      <div
        style={{
          backgroundImage: user.coverPhotoUrl
            ? `url(${user.coverPhotoUrl})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className={styles.coverContainer}
      >
        <div className={styles.coverPhoto}></div>

        <div className={styles.headingContainer}>
          <div className={styles.headingTextContainer}>
            <h1 className={styles.heading}>{user.displayName}</h1>
            <h2 className={styles.subheading}>
              {user.category}
              {user.tags.map((t, i) => {
                return (
                  <span className={styles.tag} key={t}>
                    {i !== 0 ? "| " : ""}
                    {t}
                  </span>
                );
              })}
            </h2>
            <h3 className={styles.subheadingSmall}>
              {user.city},{" "}
              {user.stateOrProvince ? user.stateOrProvince + ", " : ""}{" "}
              {user.country}
            </h3>
          </div>
        </div>
        <div
          style={{
            backgroundImage: user.profilePicUrl
              ? `url(${user.profilePicUrl})`
              : "none",
          }}
          className={styles.profilePic}
        ></div>
      </div>
      {isAuthenticated && user && u && (
        <div className={styles.interactionBtnsContainer}>
          <Link
            className="btn-save"
            style={{
              display: "flex",
              alignItems: "center",
              color: "white",
              textDecoration: "none",
              width: "fit-content",
              justifyContent: "space-between",
              color: "#121212",
            }}
            to={"/message"}
            onClick={() => {
              setParticipantID(user._id);
              setParticipantName(user.displayName);
              setParticipantProfilePicUrl(user.profilePicUrl || "");
              setParticipantProfileUrl(user.profileUrl);
            }}
          >
            <FontAwesomeIcon icon={faCommentAlt} size="2x" color={"white"} />
            <p
              style={{ margin: 0, marginLeft: "8px" }}
            >{`Send ${user.displayName} a message`}</p>
          </Link>
          {u && u.blockedUsers && (
            <button
              className="btn-cancel"
              disabled={blockButtonDisabled}
              onClick={() => {
                setBlockButtonDisabled(true);
                onToggleBlockedStatus(user._id)
                  .then(() => {
                    setBlockButtonDisabled(false);
                  })
                  .catch(() => {
                    setBlockButtonDisabled(false);
                  });
              }}
            >
              {!u.blockedUsers.includes(user._id) ? "⚠️ Block" : "⚠️ Unblock"}
            </button>
          )}
          {u && u.reportedUsers && !u.reportedUsers.includes(user._id) ? (
            <button
              className="btn-cancel"
              onClick={() => {
                setShowReportUserModal(true);
              }}
            >
              ⚠️ Report
            </button>
          ) : (
            <span className={styles.text}>User Reported.</span>
          )}
        </div>
      )}
      {isAuthenticatedMod && user && (
        <div className={styles.interactionBtnsContainer}>
          {user.reported && !suspended && (
            <span className={styles.text}>⚠️ This user has been reported.</span>
          )}
          {!suspended ? (
            <button
              className="btn-delete"
              onClick={() => setShowSuspendUserModal(true)}
            >
              Suspend This User
            </button>
          ) : (
            <span className={styles.text}>
              ❌ This user has been suspended.
            </span>
          )}
        </div>
      )}
      <div className={styles.contentContainer}>
        <div className={styles.contentInnerContainer}>
          <h2 className={styles.contentHeading}>About</h2>
          <pre id="about" className={styles.textContent}>
            {user.about}
          </pre>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.contentInnerContainer}>
          <h2 className={styles.contentHeading}>Links</h2>
          <div className={styles.links}>
            <div className={styles.readonlyLinksContainer}>
              {user.links &&
                user.links.map((link) => {
                  return (
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.link}
                    >
                      {link}
                    </a>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.contentInnerContainer}>
          <h2 className={styles.contentHeading}>Visual Media</h2>
          <div className={styles.thumbnailsContainer}>
            {user.visualMedia.map((obj, index) => {
              return (
                <Thumbnail
                  url={obj.url}
                  title={obj.title}
                  editable={false}
                  deleteImg={() => {
                    return new Promise((resolve, reject) => {
                      reject();
                    });
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
      <ContentBox titlePosition="left" titleText="Upcoming Events">
        {upcomingEvents.length > 0 ? (
          <Events events={upcomingEvents} />
        ) : (
          <p className={styles.noDataMessage}>
            This user does not have any upcoming events.
          </p>
        )}
      </ContentBox>
      <ContentBox titlePosition="right" titleText="Calendar">
        <WeekViewOtherUser
          startDate={(() => {
            const today = new Date(Date.now());
            const year = today.getFullYear();
            let month = String(today.getMonth() + 1);
            let date = String(today.getDate());
            if (month.length < 2) month = "0".concat(month);
            if (date.length < 2) date = "0".concat(date);
            return `${year}-${month}-${date}`;
          })()}
          user={user}
        />
      </ContentBox>
      <AudioPlayer audioArray={user.audioMedia} />
      <div style={{ width: "100%", height: "110px" }}></div>
      {showReportUserModal && (
        <div className={styles.modalContainer}>
          <div className={styles.modal}>
            <div className={styles.closeBtnContainer}>
              <button
                onClick={() => setShowReportUserModal(false)}
                className={styles.closeBtn}
              >
                <FontAwesomeIcon icon={faTimes} color="white" size="2x" />
              </button>
            </div>
            <h2 className={styles.modalHeading}>Report This User</h2>
            <label className={styles.text}>Select Reason(s):</label>
            <br />
            <input
              type="checkbox"
              value="sexual content"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!reportReasons.includes(e.target.value)) {
                    setReportReasons([...reportReasons, e.target.value]);
                  }
                } else {
                  if (reportReasons.includes(e.target.value)) {
                    setReportReasons(
                      reportReasons.filter((r) => {
                        return r !== e.target.value;
                      })
                    );
                  }
                }
              }}
            />
            <label className={styles.text}>Sexual content</label>
            <br />
            <input
              type="checkbox"
              value="violent/repulsive content"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!reportReasons.includes(e.target.value)) {
                    setReportReasons([...reportReasons, e.target.value]);
                  }
                } else {
                  if (reportReasons.includes(e.target.value)) {
                    setReportReasons(
                      reportReasons.filter((r) => {
                        return r !== e.target.value;
                      })
                    );
                  }
                }
              }}
            />
            <label className={styles.text}>Violent/Repulsive content</label>
            <br />
            <input
              type="checkbox"
              value="hateful/abusive content"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!reportReasons.includes(e.target.value)) {
                    setReportReasons([...reportReasons, e.target.value]);
                  }
                } else {
                  if (reportReasons.includes(e.target.value)) {
                    setReportReasons(
                      reportReasons.filter((r) => {
                        return r !== e.target.value;
                      })
                    );
                  }
                }
              }}
            />
            <label className={styles.text}>Hateful/Abusive content</label>
            <br />
            <input
              type="checkbox"
              value="spam/harassment"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!reportReasons.includes(e.target.value)) {
                    setReportReasons([...reportReasons, e.target.value]);
                  }
                } else {
                  if (reportReasons.includes(e.target.value)) {
                    setReportReasons(
                      reportReasons.filter((r) => {
                        return r !== e.target.value;
                      })
                    );
                  }
                }
              }}
            />
            <label className={styles.text}>
              Spam/harassment via messaging/booking reqests
            </label>
            <br />
            <input
              type="checkbox"
              value="illegal activities"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!reportReasons.includes(e.target.value)) {
                    setReportReasons([...reportReasons, e.target.value]);
                  }
                } else {
                  if (reportReasons.includes(e.target.value)) {
                    setReportReasons(
                      reportReasons.filter((r) => {
                        return r !== e.target.value;
                      })
                    );
                  }
                }
              }}
            />
            <label className={styles.text}>Illegal activities</label>
            <br />
            <input
              type="checkbox"
              value="copyright infringement"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!reportReasons.includes(e.target.value)) {
                    setReportReasons([...reportReasons, e.target.value]);
                  }
                } else {
                  if (reportReasons.includes(e.target.value)) {
                    setReportReasons(
                      reportReasons.filter((r) => {
                        return r !== e.target.value;
                      })
                    );
                  }
                }
              }}
            />
            <label className={styles.text}>Copyright infringement</label>
            <br />
            <input
              type="checkbox"
              value="child abuse"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!reportReasons.includes(e.target.value)) {
                    setReportReasons([...reportReasons, e.target.value]);
                  }
                } else {
                  if (reportReasons.includes(e.target.value)) {
                    setReportReasons(
                      reportReasons.filter((r) => {
                        return r !== e.target.value;
                      })
                    );
                  }
                }
              }}
            />
            <label className={styles.text}>Child abuse</label>
            <br />
            <input
              type="checkbox"
              value="impersonation"
              onChange={(e) => {
                if (e.target.checked) {
                  if (!reportReasons.includes(e.target.value)) {
                    setReportReasons([...reportReasons, e.target.value]);
                  }
                } else {
                  if (reportReasons.includes(e.target.value)) {
                    setReportReasons(
                      reportReasons.filter((r) => {
                        return r !== e.target.value;
                      })
                    );
                  }
                }
              }}
            />
            <label className={styles.text}>Impersonation</label>
            <br />
            <br />
            <label className={styles.text}>
              <i>
                If you are sure you would like to report this user, type
                "report" below. This field is case-sensitive.
              </i>
            </label>
            <br />
            <br />
            <input
              type="text"
              className="textInput"
              placeholder="report"
              id="confirmReportIntent"
              value={confirmReportIntent}
              onChange={(e) => {
                setConfirmReportIntent(e.target.value);
              }}
            />
            <br />
            <br />
            <p className={styles.errorMessage}>{reportError}</p>
            <button
              className="btn-cancel"
              style={{ float: "right" }}
              onClick={() => {
                if (reportReasons.length === 0) {
                  setReportError(
                    "You must select a reason for reporting this user."
                  );
                  return;
                }
                if (confirmReportIntent !== "report") {
                  const confirmReportInput = document.getElementById(
                    "confirmReportIntent"
                  );
                  confirmReportInput.classList.add(styles.required);
                  setReportError(
                    'You must type "report" above to confirm that you wish to report this user.'
                  );
                  return;
                }
                const reason = reportReasons.join(", ");
                onReportUser(user._id, reason)
                  .then(() => {
                    setShowReportUserModal(false);
                  })
                  .catch((e) => {
                    setReportError("Failed to report user.");
                  });
              }}
            >
              Report
            </button>
          </div>
        </div>
      )}
      {showSuspendUserModal && (
        <div className={styles.modalContainer}>
          <div className={styles.modal}>
            <div className={styles.closeBtnContainer}>
              <button
                onClick={() => setShowSuspendUserModal(false)}
                className={styles.closeBtn}
              >
                <FontAwesomeIcon icon={faTimes} color="white" size="2x" />
              </button>
            </div>
            <h2 className={styles.modalHeading}>Suspend This User</h2>
            <p className={styles.text}>
              A suspended user's subscription will be terminated, they will be
              unable to login, and other users will not be able to see them or
              interact with their page.
            </p>
            <label className={styles.text}>
              <i>
                If you are sure you would like to suspend this user, type
                "suspend" below. This field is case-sensitive.
              </i>
            </label>
            <br />
            <br />
            <input
              type="text"
              className="textInput"
              placeholder="suspend"
              id="confirmSuspendIntent"
              value={confirmSuspendIntent}
              onChange={(e) => {
                setConfirmSuspendIntent(e.target.value);
              }}
            />
            <br />
            <br />
            <p className={styles.errorMessage}>{suspendError}</p>
            <button
              className="btn-delete"
              style={{ float: "right" }}
              onClick={() => {
                if (confirmSuspendIntent !== "suspend") {
                  const confirmSuspendInput = document.getElementById(
                    "confirmSuspendIntent"
                  );
                  confirmSuspendInput.classList.add(styles.required);
                  setSuspendError(
                    'You must type "suspend" above to confirm that you wish to suspend this user.'
                  );
                  return;
                }
                axios
                  .post("/suspend_user", { userIDToSuspend: user._id })
                  .then(() => {
                    setSuspended(true);
                    setShowSuspendUserModal(false);
                  })
                  .catch((e) => {
                    setSuspendError(e.message);
                  });
              }}
            >
              Suspend
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div>
      <h3>User not found</h3>
    </div>
  );
};
