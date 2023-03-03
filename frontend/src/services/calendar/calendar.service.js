import axios from "axios";
import FormData from "form-data";
import { DateTime, Interval } from "luxon";
import { iterateThroughTimes, mergeDeep } from "../../utils/calendar-utils";

export const createEventRequest = (eventData, file) => {
  console.log("createEventRequest: eventData -> ", eventData, ", file", file);
  return new Promise(async (resolve, reject) => {
    try {
      const bodyFormData = new FormData();
      bodyFormData.append("eventData", JSON.stringify(eventData));
      bodyFormData.append("file", file);
      const res = await axios({
        method: "post",
        url: `/new_event`,
        data: bodyFormData,
      });
      resolve(res.data);
    } catch (e) {
      reject(e);
    }
  });
};

export const getEventsAndCalendar = (uid) => {
  console.log("getEventsAndCalendar: uid -> ", uid);
  //first check if its saved in the indexed DB
  return new Promise((resolve, reject) => {
    axios
      .get(`/user_events/${uid}`)
      .then((res) => {
        let events = res.data;
        let aggregateUpdateObj = {};
        events.forEach((event) => {
          const startDate = DateTime.fromISO(event.startTime).toUTC();
          const endDate = DateTime.fromISO(event.endTime).toUTC();
          //get the starting and ending military times
          let startHours = startDate.hour.toString();
          let startMins = startDate.minute.toString();
          if (startHours.length < 2) startHours = "0".concat(startHours);
          if (startMins.length < 2) startMins = "0".concat(startMins);
          const startTime = startHours.concat(startMins);
          let endHours = endDate.hour.toString();
          let endMins = endDate.minute.toString();
          if (endHours.length < 2) endHours = "0".concat(endHours);
          if (endMins.length < 2) endMins = "0".concat(endMins);
          const endTime = endHours.concat(endMins);
          //find the difference in days between the start time and end time. Round down because decimal values are still part of the same day
          const difference = Interval.fromDateTimes(
            DateTime.fromObject({
              year: startDate.year,
              month: startDate.month,
              day: startDate.day,
              hour: 12,
              minute: 0,
            }),
            DateTime.fromObject({
              year: endDate.year,
              month: endDate.month,
              day: endDate.day,
              hour: 12,
              minute: 0,
            })
          ).length("days");
          let UTCtimes = [];
          //times cb
          const timesCb = (dt) => (t) => {
            const hour = t.slice(0, 2);
            const minute = t.slice(2);
            UTCtimes.push(
              DateTime.fromObject(
                {
                  year: dt.year,
                  month: dt.month,
                  day: dt.day,
                  hour,
                  minute,
                },
                { zone: "utc" }
              )
            );
          };
          //if the start and end times occur on the same day, iterate through one day of times, if not loop through multiple days
          if (difference === 0) {
            iterateThroughTimes(startTime, endTime, timesCb(startDate));
          } else {
            iterateThroughTimes(startTime, "2345", timesCb(startDate));
            for (let i = 1; i < difference; i++) {
              iterateThroughTimes(
                "0000",
                "2345",
                timesCb(startDate.plus({ days: i }))
              );
            }
            iterateThroughTimes("0000", endTime, timesCb(endDate));
          }
          //remove the last item from UTCtimes as it corresponds to the actual ending time of the event, not the last filled time slot
          UTCtimes.pop();
          for (const dt of UTCtimes) {
            let updatedCalendarObj = {};
            const { year, month, day, hour, minute } = dt;
            let paddedHour = hour.toString();
            let paddedMinutes = minute.toString();
            if (paddedHour.length < 2) paddedHour = "0".concat(paddedHour);
            if (paddedMinutes.length < 2)
              paddedMinutes = "0".concat(paddedMinutes);
            const time = paddedHour.concat(paddedMinutes);
            updatedCalendarObj = {
              [year]: {
                [month]: {
                  [day]: {
                    [time]: {
                      event,
                    },
                  },
                },
              },
            };
            aggregateUpdateObj = mergeDeep(
              aggregateUpdateObj,
              updatedCalendarObj
            );
          }
        });
        //sort events in ascending order
        events = events.sort((a, b) => {
          return new Date(a.startTime) - new Date(b.startTime);
        });
        resolve({
          events: events,
          calendar: aggregateUpdateObj,
        });
      })
      .catch((e) => {
        reject(e);
      });
  });
};

export const getEvent = (id) => {
  console.log("getEvent: id -> ", id);
  return axios.get(`/find_event/${id}`);
};

export const updateEventRequest = (eventID, updatedEventObj) => {
  console.log("updateEventRequest: eventID -> ", eventID, ", updatedEventObj", updatedEventObj);
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.put(`/update_event`, {
        eventID,
        updatedEventObj,
      });
      resolve(res.data);
    } catch (e) {
      reject(e);
    }
  });
};

export const deleteEventRequest = (eventID) => {
  console.log("deleteEventRequest: eventID -> ", eventID);
  return new Promise(async (resolve, reject) => {
    try {
      await axios.delete(`/delete_event`, {
        data: {
          eventID,
        },
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

export const eventReqRequest = (recipient, eventData) => {
  console.log("eventReqRequest: recipient -> ", recipient, ", eventData", eventData);
  return new Promise(async (resolve, reject) => {
    try {
      const {
        startTime,
        endTime,
        title,
        description,
        isOnline,
        venueName,
        streetAddressLine1,
        streetAddressLine2,
        city,
        stateOrProvince,
        postalCode,
        country,
        payrateOffer,
        message,
      } = eventData;
      await axios.post(`/eventrequests/new`, {
        recipient,
        startTime,
        endTime,
        title,
        description,
        isOnline,
        venueName,
        streetAddressLine1,
        streetAddressLine2,
        city,
        stateOrProvince,
        postalCode,
        country,
        payrateOffer,
        message,
      });
      resolve("success");
    } catch (e) {
      reject(e);
    }
  });
};

export const updateEventReqRequest = (eventRequestID, fieldValuePairs) => {
  console.log("updateEventReqRequest: eventRequestID -> ", eventRequestID, ", fieldValuePairs", fieldValuePairs);
  return new Promise(async (resolve, reject) => {
    try {
      const updatedEvent = await axios.put("/eventrequests/update", {
        eventRequestID,
        fieldValuePairs,
      });
      resolve(updatedEvent);
    } catch (e) {
      reject(e);
    }
  });
};
