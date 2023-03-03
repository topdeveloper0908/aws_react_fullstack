import React, { useContext, useEffect, useState } from "react";
import styles from "./event-requests.module.css";
import jstz from "jstz";
import { getShortTZ } from "../../profiles/components/calendar/utils";
import { DateTime } from "luxon";
import { AuthenticationContext } from "../../../services/authentication/authentication.context";
import { SingleEventRequest } from "../components/SingleEventRequest.component";

function wasRead(request, userID) {
  return (
    (request.senderID === userID && request.readBySender) ||
    (request.recipientID === userID && request.readByRecipient)
  );
}

function Request({ r, user, tz, setEventToShow }) {
  const dt = DateTime.fromISO(r.lastRespondedToAt);
  let hour = dt.hour;
  let minute = dt.minute.toString();
  let amOrPm = "AM";
  if (hour >= 12) {
    amOrPm = "PM";
  }
  if (hour > 12) {
    hour = hour - 12;
  }
  if (minute.length < 2) minute = "0".concat(minute);
  const time = `${hour}:${minute} ${amOrPm}`;
  return (
    <li
      className={styles.request}
      style={{ fontWeight: wasRead(r, user._id) ? "400" : "600" }}
      onClick={() => {
        setEventToShow(r._id);
      }}
    >
      <p className={styles.responsiveText}>
        <span>
          {r.recipientID === user._id
            ? `FROM: ${r.sender[0].displayName}`
            : `TO: ${r.recipient[0].displayName}`}
        </span>
        <span>{`${time} on ${dt.toLocaleString()} ${getShortTZ(tz)}`}</span>
      </p>
      <p>{r.title}</p>
      <p>{r.declined && "❌ This event request was declined."}</p>
      {r.acceptedOffer && <p>✅ This event request was accepted!</p>}
    </li>
  );
}

export const EventRequestsScreen = () => {
  const { user, eventRequests } = useContext(AuthenticationContext);
  const [sortedRequests, setSortedRequests] = useState([]);
  const [requestTypeToShow, setRequestTypeToShow] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const tz = jstz.determine().name();

  useEffect(() => {
    const filteredRequests = eventRequests.filter((r) => {
      const otherPartyID = r.senderID === user._id ? r.recipientID : r.senderID;
      if (
        user.blockedUsers.includes(otherPartyID) ||
        user.blockedByUsers.includes(otherPartyID)
      ) {
        return false;
      } else return true;
    });
    const sortedAndFilteredRequests = filteredRequests.sort((a, b) => {
      const wasReadA = Number(wasRead(a, user._id));
      const wasReadB = Number(wasRead(b, user._id));
      if (wasReadA !== wasReadB) return wasReadA - wasReadB;
      //if the event requests were both read, sort by which was responded to more recently
      else {
        return new Date(b.lastRespondedToAt) - new Date(a.lastRespondedToAt);
      }
    });
    setSortedRequests(sortedAndFilteredRequests);
  }, [eventRequests]);

  return (
    <div className={styles.eventRequestsScreen}>
      <div className={styles.eventRequestsInnerContainer}>
        {!selectedRequest ? (
          <>
            <h1 className={styles.heading}>Event Requests</h1>
            <div className={styles.requestTypeBreadcrumb}>
              <button
                className={`${styles.requestTypeBtn} ${
                  requestTypeToShow === "received" && styles.requestTypeSelected
                }`}
                onClick={() => setRequestTypeToShow("received")}
              >
                Received
              </button>
              <button
                className={`${styles.requestTypeBtn} ${
                  requestTypeToShow === "sent" && styles.requestTypeSelected
                }`}
                onClick={() => setRequestTypeToShow("sent")}
              >
                Sent
              </button>
              <button
                className={`${styles.requestTypeBtn} ${
                  requestTypeToShow === "all" && styles.requestTypeSelected
                }`}
                onClick={() => setRequestTypeToShow("all")}
              >
                All
              </button>
            </div>
            <ul className={styles.requests}>
              {requestTypeToShow === "all" &&
                sortedRequests.map((r) => {
                  return (
                    <Request
                      r={r}
                      user={user}
                      tz={tz}
                      setEventToShow={setSelectedRequest}
                    />
                  );
                })}
              {requestTypeToShow === "received" &&
                sortedRequests
                  .filter((r) => {
                    return r.recipientID === user._id;
                  })
                  .map((r) => {
                    return (
                      <Request
                        r={r}
                        user={user}
                        tz={tz}
                        setEventToShow={setSelectedRequest}
                      />
                    );
                  })}
              {requestTypeToShow === "sent" &&
                sortedRequests
                  .filter((r) => {
                    return r.senderID === user._id;
                  })
                  .map((r) => {
                    return (
                      <Request
                        r={r}
                        user={user}
                        tz={tz}
                        setEventToShow={setSelectedRequest}
                      />
                    );
                  })}
            </ul>
          </>
        ) : (
          <SingleEventRequest
            eventRequestID={selectedRequest}
            setParentSelectedRequest={setSelectedRequest}
          />
        )}
      </div>
    </div>
  );
};
