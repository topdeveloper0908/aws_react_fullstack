import axios from "axios";
import { getEventsAndCalendar } from "../calendar/calendar.service";

export const getUserByLink = (link) => {
  console.log("getUserByLink: link: ", link);
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.get(`/api/users/${link}`);
      let user = res.data;
      const eventsAndCalendar = await getEventsAndCalendar(user._id);
      user = {
        ...user,
        calendar: eventsAndCalendar.calendar,
        events: eventsAndCalendar.events,
      };
      resolve(user);
    } catch (e) {
      reject(e);
    }
  });
};
