import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthenticationContext } from "../../services/authentication/authentication.context";
import { MessagingContext } from "../../services/messaging/messaging.context";
import styles from "./message-thread.module.css";
import {
  sendNewMessage,
  replyToThread,
  setHasRead,
} from "../../services/messaging/messaging-service";
import userIcon from "../../assets/images/user-icon.png";

export const MessageThread = () => {
  const {
    participantID,
    participantName,
    participantProfilePicUrl,
    participantProfileUrl,
  } = useContext(MessagingContext);
  const {
    user,
    messageThreads,
    setMessageThreads,
    onNewMessage,
    setUnreadMessages,
    countAndAggregateUnreadMessages,
  } = useContext(AuthenticationContext);
  const [messageThread, setMessageThread] = useState({
    participantIDs: [],
    participantNames: [],
    messages: [],
  });
  const [messageToSend, setMessageToSend] = useState("");
  const [isNew, setIsNew] = useState(true);
  const [error, setError] = useState("");

  //see if the user has a message thread already started with this other user
  //if they do, display that message thread, if they don't this will be a new message thread

  useEffect(() => {
    //try to find the thread
    const foundThread = messageThreads.find((thread) => {
      return Boolean(
        thread.participants.find((p) => {
          return p._id === participantID;
        })
      );
    });
    //if a thread was found, set it as the message thread
    if (foundThread) {
      setIsNew(false);
      //set has read to true and update the user's unreadMessages
      setHasRead(foundThread._id)
        .then((updatedThreads) => {
          setUnreadMessages(
            countAndAggregateUnreadMessages(updatedThreads, user._id)
          );
        })
        .catch((e) => console.log(e));
      setMessageThread(foundThread);
    } else {
      setIsNew(true);
      setMessageThread({
        participantIDs: [user._id, participantID],
        participantNames: [user.displayName, participantName],
        messages: [],
      });
    }
  }, [messageThreads]);

  useEffect(() => {
    window.scrollTo(0, document.body.scrollHeight);
  }, [messageThread]);

  return (
    <div className={styles.screen}>
      {!user.blockedUsers.includes(participantID) &&
      !user.blockedByUsers.includes(participantID) ? (
        <>
          <div className={styles.messageInfoContainer}>
            <div className={styles.messageInfoInnerContainer}>
              <div
                style={{
                  backgroundImage: `url(${
                    participantProfilePicUrl
                      ? participantProfilePicUrl
                      : userIcon
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "50%",
                  height: "75px",
                  width: "75px",
                  minHeight: "75px",
                  minWidth: "75px",
                  border: "3px solid white",
                  marginRight: "8px",
                }}
              ></div>
              <h3 className={styles.text}>
                Conversation with{" "}
                <Link
                  to={`/user?user=${participantProfileUrl}`}
                  style={{ color: "yellow" }}
                >
                  {participantName}
                </Link>
              </h3>
            </div>
          </div>
          <ul className={styles.messages}>
            {messageThread.messages.map((m) => {
              return (
                <li
                  className={
                    m.senderID === user._id
                      ? styles.messageSent
                      : styles.messageReceived
                  }
                >
                  <pre>{m.message}</pre>
                </li>
              );
            })}
          </ul>

          <div className={styles.newMessageContainer}>
            <p className={styles.errorText}>{error}</p>
            <div className={styles.newMessageInnerContainer}>
              <textarea
                className={styles.textarea}
                value={messageToSend}
                onChange={(e) => {
                  setMessageToSend(e.target.value);
                }}
              />
              <button
                className="btn-save"
                onClick={() => {
                  if (isNew) {
                    sendNewMessage(messageToSend, participantID)
                      .then((updatedThreads) => {
                        setMessageThreads(updatedThreads);
                        onNewMessage(participantID);
                        setError("");
                      })
                      .catch((e) => {
                        setError("Could not message");
                      });
                  } else {
                    replyToThread(
                      messageToSend,
                      messageThread._id,
                      participantID
                    )
                      .then((updatedThreads) => {
                        setMessageThreads(updatedThreads);
                        onNewMessage(participantID);
                        setError("");
                      })
                      .catch((e) => {
                        setError("Could not send message");
                      });
                  }
                }}
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.blockedMessageContainer}>
          <h2 className={styles.text}>
            Interactions with this user are currently blocked. If you accidently
            blocked them, you can unblock them by visiting their profile page.
          </h2>
        </div>
      )}
    </div>
  );
};
