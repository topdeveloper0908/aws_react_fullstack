import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthenticationContext } from "../authentication/authentication.context";
import { DateTime, Interval } from "luxon";
import { iterateThroughTimes, mergeDeep } from "../../utils/calendar-utils";
import {
  createEventRequest,
  getEventsRequest,
  updateEventRequest,
  deleteEventRequest,
  eventReqRequest,
} from "./calendar.service";

export const CalendarContext = createContext();

export const CalendarContextProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const { user, isAuthenticated, setUser } = useContext(AuthenticationContext);
  const [prefilledEventData, setPrefilledEventData] = useState(null);

  //create a new event
  const onCreateEvent = (eventData, file) => {
    console.log("onCreateEvent: eventData -> ", eventData, ", file", file);
    return new Promise((resolve, reject) => {
      createEventRequest(eventData, file)
        .then((event) => {
          resolve(event);
        })
        .catch((e) => {
          setError(e);
          reject(e);
        });
    });
  };

  const onUpdateEvent = (eventID, updatedEventObj) => {
    console.log("onUpdateEvent: eventID -> ", eventID, ", updatedEventObj", updatedEventObj);
    return new Promise((resolve, reject) => {
      updateEventRequest(eventID, updatedEventObj)
        .then((event) => {
          resolve(event);
        })
        .catch((e) => {
          setError(e);
          reject(e);
        });
    });
  };

  const onDeleteEvent = (eventID) => {
    console.log("onDeleteEvent: eventID -> ", eventID);
    return new Promise((resolve, reject) => {
      deleteEventRequest(eventID)
        .then(() => {
          resolve();
        })
        .catch((e) => {
          setError(e);
          reject(e);
        });
    });
  };

  return (
    <CalendarContext.Provider
      value={{
        onCreateEvent,
        onUpdateEvent,
        onDeleteEvent,
        prefilledEventData,
        setPrefilledEventData,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};
