import React, { useState, useContext, useEffect } from "react";
import userIcon from "../../assets/images/user-icon.png";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { MessagingContext } from "../../services/messaging/messaging.context";
import styles from "./all-message-threads.module.css";
import { sortAndFilter } from "./utils";

export const AllMessageThreadsScreen = () => {
  const { user, messageThreads, unreadMessages } = useContext(
    AuthenticationContext
  );
  const {
    setParticipantID,
    setParticipantName,
    setParticipantProfilePicUrl,
    setParticipantProfileUrl,
  } = useContext(MessagingContext);

  const sortedAndFilteredThreads = sortAndFilter(messageThreads, user);

  return (
    <div className={styles.screen}>
      <h2 style={{ fontFamily: "Noto Sans Display", color: "white" }}>
        Messages
      </h2>
      <ul className={styles.messageThreads}>
        {sortedAndFilteredThreads.map((m) => {
          const otherParty = m.participants.find((p) => {
            return p._id !== user._id;
          });

          return (
            <li>
              <Link
                to={"/message"}
                onClick={() => {
                  setParticipantID(otherParty._id);
                  setParticipantName(otherParty.displayName);
                  setParticipantProfilePicUrl(otherParty.profilePicUrl || "");
                  setParticipantProfileUrl(otherParty.profileUrl);
                }}
                className={styles.messageThread}
              >
                <div
                  style={{
                    backgroundImage: `url(${
                      otherParty.profilePicUrl
                        ? otherParty.profilePicUrl
                        : userIcon
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "50%",
                    height: "75px",
                    width: "75px",
                    border: "3px solid white",
                    marginRight: "8px",
                  }}
                ></div>
                <p
                  style={{
                    fontWeight: unreadMessages.unreadIDs.includes(m._id)
                      ? "bold"
                      : "regular",
                  }}
                >
                  {m.messages[m.messages.length - 1].message}
                </p>
                {unreadMessages.unreadIDs.includes(m._id) && (
                  <div className={styles.newMessageTextContainer}>
                    <p className={styles.newMessageText}>NEW</p>
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
