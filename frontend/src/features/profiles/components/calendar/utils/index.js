import { DateTime, Interval } from "luxon";

//converts a military time string to stadard time format for UI display
export function militaryToStandard(t) {
  let hours = Number(t.slice(0, 2));
  const minutes = t.slice(2);
  let amOrPM = "AM";
  if (hours >= 12 && hours !== 24) {
    amOrPM = "PM";
  }
  if (hours > 12) {
    hours -= 12;
  } else if (hours === 0) {
    hours = 12;
  }
  const time = `${hours}:${minutes} ${amOrPM}`;
  return time;
}

//returns the minimum time of an array. Used for getting the starting time out of the selectedTimes array in the WeekView component
export function min(arr) {
  if (arr.length > 0) {
    let minN = 2400;
    let minV;
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i].time;
      const n = Number(v);
      if (n < minN) {
        minN = n;
        minV = v;
      }
    }
    return minV;
  } else return "0000";
}

//returns the maximum time from an array. Used for getting the ending time out of the selectedTimes array in the WeekView component
export function max(arr) {
  if (arr.length > 0) {
    let maxN = 0;
    let maxV = "0000";
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i].time;
      const n = Number(v);
      if (n > maxN) {
        maxN = n;
        maxV = v;
      }
    }
    return maxV;
  } else return "0000";
}

//iterate through a series of military time strings and do something with each time
export function iterateThroughTimes(startTime, endTime, cb) {
  //fill in times between start and end time
  let counter;
  switch (startTime.slice(2)) {
    case "00":
      counter = 0;
      break;
    case "15":
      counter = 1;
      break;
    case "30":
      counter = 2;
      break;
    case "45":
      counter = 3;
      break;
    default:
      counter = 0;
      break;
  }
  for (let i = Number(startTime); i <= Number(endTime); ) {
    //pad the numerical value i with 0's
    let iToString = String(i);
    for (let j = iToString.length; j < 4; j++) {
      iToString = "0".concat(iToString);
    }
    //call the callback function
    cb(iToString);
    //depending on counter, add 15 minutes or if at 45, add 55 so it loops to the next hour
    if (counter < 3) {
      i += 15;
      counter++;
    } else {
      i += 55;
      counter = 0;
    }
  }
}

//iterate through a series of days, assign them a weekday string, and do something via callback cb with the day, date, month, year and index
export function iterateThroughDays(tz, startDate, numOfDays, cb) {
  const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let initialDate = DateTime.fromISO(startDate);
  let d = DateTime.fromObject(
    { year: initialDate.year, month: initialDate.month, day: initialDate.day },
    { zone: tz }
  );

  for (let i = 0; i < numOfDays; i++) {
    const day = weekdays[d.weekday - 1];
    const date = d.day;
    const month = Number(d.month);
    const year = d.year;
    cb(day, date, month, year, i);
    d = d.plus({ days: 1 });
  }
  return;
}

//get the month and year and format them like "August, 1988" . Used for displaying the current month in the WeekView component
export const dateToMonthAndYear = (d) => {
  const date = new Date(d);
  const year = date.getUTCFullYear();
  let month = date.getUTCMonth(); //returns 0 for january

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  month = months[Number(month)];

  return `${month}, ${year}`;
};

/*convert a given time to UTC so it can be looked up in the calendar. Then look it up in the calendar and assign it 
either the found event or null. Used in defineWeek within the addTimeslots function. */
export const convertToUTCAndLookUp = (
  calendar,
  tz,
  year,
  month,
  date,
  time
) => {
  const hour = time.slice(0, 2);
  const minute = time.slice(2);
  const dtUTC = DateTime.fromObject(
    { year, month, day: date, hour, minute },
    { zone: tz }
  ).toUTC();
  const { year: y, month: m, day: d, hour: hr, minute: min } = dtUTC;
  let paddedHour = hr.toString();
  let paddedMinute = min.toString();
  if (paddedHour.length < 2) paddedHour = "0".concat(paddedHour);
  if (paddedMinute.length < 2) paddedMinute = "0".concat(paddedMinute);
  const utcTime = paddedHour.concat(paddedMinute);
  const event =
    calendar[y] &&
    calendar[y][m] &&
    calendar[y][m][d] &&
    calendar[y][m][d][utcTime] &&
    calendar[y][m][d][utcTime].event
      ? calendar[y][m][d][utcTime].event
      : null;
  return event;
};

//defines a week object which is transformed into the UI calendar display. used in WeekView
export const defineWeek = (startD, calendar, tz, isOtherUser) => {
  const addTimeslots = (y, m, d) => {
    const hours = {};
    const hoursCb = (t) => {
      let event = convertToUTCAndLookUp(calendar, tz, y, m, d, t);
      if (event && event.color) {
        if (isOtherUser && !event.isPublic) {
          event = {
            isPublic: false,
            color: "#5c5f5c",
          };
        }
      }
      hours[t] = {
        event,
      };
    };
    iterateThroughTimes("0000", "2345", hoursCb);
    return hours;
  };

  const week = { years: {}, start: "", end: "" };
  week.start = dateToMonthAndYear(startD);
  const daysCallback = (day, date, month, year, index) => {
    if (!week.years[year]) week.years[year] = {};
    if (!week.years[year][month]) week.years[year][month] = {};
    if (!week.years[year][month][date]) week.years[year][month][date] = {};
    week.years[year][month][date].day = day;
    week.years[year][month][date].timeslots = addTimeslots(year, month, date);
    if (index === 6) {
      week.end = dateToMonthAndYear(`${year}-${month}-${date}`);
    }
  };
  iterateThroughDays(tz, startD, 7, daysCallback);

  return week;
};

//takes the timezone string that tz returns and that is used by DateTime and returns its abbreviation, for UI display purposes.
export const getShortTZ = (tz) => {
  var dt = DateTime.now().setZone(tz);
  return dt.offsetNameShort;
};

/*adds 15 minutes to a military time string. typically used to convert the last occupied timeslot to that actual ending time of
an event, which is at the end of that final 15 minute block. */
export const add15Minutes = (time) => {
  let minutesToAdd;
  switch (time.slice(2)) {
    case "45":
      minutesToAdd = 55;
      break;
    default:
      minutesToAdd = 15;
      break;
  }
  let newTime = (Number(time) + minutesToAdd).toString();
  for (let j = newTime.length; j < 4; j++) {
    newTime = "0" + newTime;
  }
  return newTime;
};

//determine whether an item is an object. A helper function used in mergeDeep to merge calendar objects
export const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item);
};

//deep merges two objects. used to merge a new calendar entry with an existing calendar object
export const mergeDeep = (target, source) => {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) Object.assign(output, { [key]: source[key] });
        else output[key] = mergeDeep(target[key], source[key]);
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
};

//returns a string in the format "8/21/1988 at 11:00 AM - 4:00 PM on 8/16/1989"
export const eventTimesToLocalTZ = (tz, startTimeISO, endTimeISO) => {
  const startDt = DateTime.fromISO(startTimeISO, { zone: tz });
  const endDt = DateTime.fromISO(endTimeISO, { zone: tz });
  const startDate = `${startDt.month}/${startDt.day}/${startDt.year}`;
  const endDate = `${endDt.month}/${endDt.day}/${endDt.year}`;
  let paddedStartHour = startDt.hour.toString();
  let paddedStartMinute = startDt.minute.toString();
  if (paddedStartHour.length < 2) paddedStartHour = "0".concat(paddedStartHour);
  if (paddedStartMinute.length < 2)
    paddedStartMinute = "0".concat(paddedStartMinute);
  let startTime = paddedStartHour.concat(paddedStartMinute);
  startTime = militaryToStandard(startTime);
  let paddedEndHour = endDt.hour.toString();
  let paddedEndMinute = endDt.minute.toString();
  if (paddedEndHour.length < 2) paddedEndHour = "0".concat(paddedEndHour);
  if (paddedEndMinute.length < 2) paddedEndMinute = "0".concat(paddedEndMinute);
  let endTime = paddedEndHour.concat(paddedEndMinute);
  endTime = militaryToStandard(endTime);
  const humanReadableTimeRange = `${startDate} at ${startTime} - ${endTime}${
    startDate !== endDate ? ` on ${endDate}` : ""
  }`;
  return humanReadableTimeRange;
};

//returns a version of the calendar with the event cleared
export const clearEvent = (c, startDateTimeISO, endDateTimeISO) => {
  //first copy the user's calendar
  const calendar = JSON.parse(JSON.stringify(c));
  const startDTObj = DateTime.fromISO(startDateTimeISO).toUTC();
  const endDTObj = DateTime.fromISO(endDateTimeISO).toUTC();
  let UTCtimes = [];
  //takes in a day and returns a function for use as a callback in the iterateThroughTimes function
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
  //create start time string in military time format to use with iterateThroughTimes
  let startHour = startDTObj.hour.toString();
  if (startHour.length < 2) startHour = "0".concat(startHour);
  let startMin = startDTObj.minute.toString();
  if (startMin.length < 2) startMin = "0".concat(startMin);
  const startTime = `${startHour}${startMin}`;
  //create end time string in military time format to use with iterateThroughTimes
  let endHour = endDTObj.hour.toString();
  if (endHour.length < 2) endHour = "0".concat(endHour);
  let endMin = endDTObj.minute.toString();
  if (endMin.length < 2) endMin = "0".concat(endMin);
  const endTime = `${endHour}${endMin}`;
  //find the difference in days between the start time and end time. Round down because decimal values are still part of the same day
  const difference = Interval.fromDateTimes(
    DateTime.fromObject({
      year: startDTObj.year,
      month: startDTObj.month,
      day: startDTObj.day,
      hour: 12,
      minute: 0,
    }),
    DateTime.fromObject({
      year: endDTObj.year,
      month: endDTObj.month,
      day: endDTObj.day,
      hour: 12,
      minute: 0,
    })
  ).length("days");
  //if the start and end times occur on the same day, iterate through one day of times, if not loop through multiple days
  if (difference === 0) {
    iterateThroughTimes(startTime, endTime, timesCb(startDTObj));
  } else {
    iterateThroughTimes(startTime, "2345", timesCb(startDTObj));
    for (let i = 1; i < difference; i++) {
      iterateThroughTimes(
        "0000",
        "2345",
        timesCb(startDTObj.plus({ days: i }))
      );
    }
    iterateThroughTimes("0000", endTime, timesCb(endDTObj));
  }
  //remove the last entry in the array because it corresponds to the end time not the last filled timeslot (for example, 1115 instead of 1100)
  UTCtimes.pop();
  //set the time to an empty object for all of the occupied time slots
  let updatedCalendarObj = calendar;
  UTCtimes.forEach((dt) => {
    const { year, month, day, hour, minute } = dt;
    let paddedHour = hour.toString();
    let paddedMinutes = minute.toString();
    if (paddedHour.length < 2) paddedHour = "0".concat(paddedHour);
    if (paddedMinutes.length < 2) paddedMinutes = "0".concat(paddedMinutes);
    const time = paddedHour.concat(paddedMinutes);
    updatedCalendarObj[year][month][day][time] = {};
  });
  return updatedCalendarObj;
};

//a list of timezones for use in the select element within WeekView
export const timezones = [
  "Europe/Andorra",
  "Asia/Dubai",
  "Asia/Kabul",
  "Europe/Tirane",
  "Asia/Yerevan",
  "Antarctica/Casey",
  "Antarctica/Davis",
  "Antarctica/DumontDUrville",
  "Antarctica/Mawson",
  "Antarctica/Palmer",
  "Antarctica/Rothera",
  "Antarctica/Syowa",
  "Antarctica/Troll",
  "Antarctica/Vostok",
  "America/Argentina/Buenos_Aires",
  "America/Argentina/Cordoba",
  "America/Argentina/Salta",
  "America/Argentina/Jujuy",
  "America/Argentina/Tucuman",
  "America/Argentina/Catamarca",
  "America/Argentina/La_Rioja",
  "America/Argentina/San_Juan",
  "America/Argentina/Mendoza",
  "America/Argentina/San_Luis",
  "America/Argentina/Rio_Gallegos",
  "America/Argentina/Ushuaia",
  "Pacific/Pago_Pago",
  "Europe/Vienna",
  "Australia/Lord_Howe",
  "Antarctica/Macquarie",
  "Australia/Hobart",
  "Australia/Currie",
  "Australia/Melbourne",
  "Australia/Sydney",
  "Australia/Broken_Hill",
  "Australia/Brisbane",
  "Australia/Lindeman",
  "Australia/Adelaide",
  "Australia/Darwin",
  "Australia/Perth",
  "Australia/Eucla",
  "Asia/Baku",
  "America/Barbados",
  "Asia/Dhaka",
  "Europe/Brussels",
  "Europe/Sofia",
  "Atlantic/Bermuda",
  "Asia/Brunei",
  "America/La_Paz",
  "America/Noronha",
  "America/Belem",
  "America/Fortaleza",
  "America/Recife",
  "America/Araguaina",
  "America/Maceio",
  "America/Bahia",
  "America/Sao_Paulo",
  "America/Campo_Grande",
  "America/Cuiaba",
  "America/Santarem",
  "America/Porto_Velho",
  "America/Boa_Vista",
  "America/Manaus",
  "America/Eirunepe",
  "America/Rio_Branco",
  "America/Nassau",
  "Asia/Thimphu",
  "Europe/Minsk",
  "America/Belize",
  "America/St_Johns",
  "America/Halifax",
  "America/Glace_Bay",
  "America/Moncton",
  "America/Goose_Bay",
  "America/Blanc-Sablon",
  "America/Toronto",
  "America/Nipigon",
  "America/Thunder_Bay",
  "America/Iqaluit",
  "America/Pangnirtung",
  "America/Atikokan",
  "America/Winnipeg",
  "America/Rainy_River",
  "America/Resolute",
  "America/Rankin_Inlet",
  "America/Regina",
  "America/Swift_Current",
  "America/Edmonton",
  "America/Cambridge_Bay",
  "America/Yellowknife",
  "America/Inuvik",
  "America/Creston",
  "America/Dawson_Creek",
  "America/Fort_Nelson",
  "America/Vancouver",
  "America/Whitehorse",
  "America/Dawson",
  "Indian/Cocos",
  "Europe/Zurich",
  "Africa/Abidjan",
  "Pacific/Rarotonga",
  "America/Santiago",
  "America/Punta_Arenas",
  "Pacific/Easter",
  "Asia/Shanghai",
  "Asia/Urumqi",
  "America/Bogota",
  "America/Costa_Rica",
  "America/Havana",
  "Atlantic/Cape_Verde",
  "America/Curacao",
  "Indian/Christmas",
  "Asia/Nicosia",
  "Asia/Famagusta",
  "Europe/Prague",
  "Europe/Berlin",
  "Europe/Copenhagen",
  "America/Santo_Domingo",
  "Africa/Algiers",
  "America/Guayaquil",
  "Pacific/Galapagos",
  "Europe/Tallinn",
  "Africa/Cairo",
  "Africa/El_Aaiun",
  "Europe/Madrid",
  "Africa/Ceuta",
  "Atlantic/Canary",
  "Europe/Helsinki",
  "Pacific/Fiji",
  "Atlantic/Stanley",
  "Pacific/Chuuk",
  "Pacific/Pohnpei",
  "Pacific/Kosrae",
  "Atlantic/Faroe",
  "Europe/Paris",
  "Europe/London",
  "Asia/Tbilisi",
  "America/Cayenne",
  "Africa/Accra",
  "Europe/Gibraltar",
  "America/Godthab",
  "America/Danmarkshavn",
  "America/Scoresbysund",
  "America/Thule",
  "Europe/Athens",
  "Atlantic/South_Georgia",
  "America/Guatemala",
  "Pacific/Guam",
  "Africa/Bissau",
  "America/Guyana",
  "Asia/Hong_Kong",
  "America/Tegucigalpa",
  "America/Port-au-Prince",
  "Europe/Budapest",
  "Asia/Jakarta",
  "Asia/Pontianak",
  "Asia/Makassar",
  "Asia/Jayapura",
  "Europe/Dublin",
  "Asia/Jerusalem",
  "Asia/Kolkata",
  "Indian/Chagos",
  "Asia/Baghdad",
  "Asia/Tehran",
  "Atlantic/Reykjavik",
  "Europe/Rome",
  "America/Jamaica",
  "Asia/Amman",
  "Asia/Tokyo",
  "Africa/Nairobi",
  "Asia/Bishkek",
  "Pacific/Tarawa",
  "Pacific/Enderbury",
  "Pacific/Kiritimati",
  "Asia/Pyongyang",
  "Asia/Seoul",
  "Asia/Almaty",
  "Asia/Qyzylorda",
  "Asia/Qostanay", // https://bugs.chromium.org/p/chromium/issues/detail?id=928068
  "Asia/Aqtobe",
  "Asia/Aqtau",
  "Asia/Atyrau",
  "Asia/Oral",
  "Asia/Beirut",
  "Asia/Colombo",
  "Africa/Monrovia",
  "Europe/Vilnius",
  "Europe/Luxembourg",
  "Europe/Riga",
  "Africa/Tripoli",
  "Africa/Casablanca",
  "Europe/Monaco",
  "Europe/Chisinau",
  "Pacific/Majuro",
  "Pacific/Kwajalein",
  "Asia/Yangon",
  "Asia/Ulaanbaatar",
  "Asia/Hovd",
  "Asia/Choibalsan",
  "Asia/Macau",
  "America/Martinique",
  "Europe/Malta",
  "Indian/Mauritius",
  "Indian/Maldives",
  "America/Mexico_City",
  "America/Cancun",
  "America/Merida",
  "America/Monterrey",
  "America/Matamoros",
  "America/Mazatlan",
  "America/Chihuahua",
  "America/Ojinaga",
  "America/Hermosillo",
  "America/Tijuana",
  "America/Bahia_Banderas",
  "Asia/Kuala_Lumpur",
  "Asia/Kuching",
  "Africa/Maputo",
  "Africa/Windhoek",
  "Pacific/Noumea",
  "Pacific/Norfolk",
  "Africa/Lagos",
  "America/Managua",
  "Europe/Amsterdam",
  "Europe/Oslo",
  "Asia/Kathmandu",
  "Pacific/Nauru",
  "Pacific/Niue",
  "Pacific/Auckland",
  "Pacific/Chatham",
  "America/Panama",
  "America/Lima",
  "Pacific/Tahiti",
  "Pacific/Marquesas",
  "Pacific/Gambier",
  "Pacific/Port_Moresby",
  "Pacific/Bougainville",
  "Asia/Manila",
  "Asia/Karachi",
  "Europe/Warsaw",
  "America/Miquelon",
  "Pacific/Pitcairn",
  "America/Puerto_Rico",
  "Asia/Gaza",
  "Asia/Hebron",
  "Europe/Lisbon",
  "Atlantic/Madeira",
  "Atlantic/Azores",
  "Pacific/Palau",
  "America/Asuncion",
  "Asia/Qatar",
  "Indian/Reunion",
  "Europe/Bucharest",
  "Europe/Belgrade",
  "Europe/Kaliningrad",
  "Europe/Moscow",
  "Europe/Simferopol",
  "Europe/Kirov",
  "Europe/Astrakhan",
  "Europe/Volgograd",
  "Europe/Saratov",
  "Europe/Ulyanovsk",
  "Europe/Samara",
  "Asia/Yekaterinburg",
  "Asia/Omsk",
  "Asia/Novosibirsk",
  "Asia/Barnaul",
  "Asia/Tomsk",
  "Asia/Novokuznetsk",
  "Asia/Krasnoyarsk",
  "Asia/Irkutsk",
  "Asia/Chita",
  "Asia/Yakutsk",
  "Asia/Khandyga",
  "Asia/Vladivostok",
  "Asia/Ust-Nera",
  "Asia/Magadan",
  "Asia/Sakhalin",
  "Asia/Srednekolymsk",
  "Asia/Kamchatka",
  "Asia/Anadyr",
  "Asia/Riyadh",
  "Pacific/Guadalcanal",
  "Indian/Mahe",
  "Africa/Khartoum",
  "Europe/Stockholm",
  "Asia/Singapore",
  "America/Paramaribo",
  "Africa/Juba",
  "Africa/Sao_Tome",
  "America/El_Salvador",
  "Asia/Damascus",
  "America/Grand_Turk",
  "Africa/Ndjamena",
  "Indian/Kerguelen",
  "Asia/Bangkok",
  "Asia/Dushanbe",
  "Pacific/Fakaofo",
  "Asia/Dili",
  "Asia/Ashgabat",
  "Africa/Tunis",
  "Pacific/Tongatapu",
  "Europe/Istanbul",
  "America/Port_of_Spain",
  "Pacific/Funafuti",
  "Asia/Taipei",
  "Europe/Kiev",
  "Europe/Uzhgorod",
  "Europe/Zaporozhye",
  "Pacific/Wake",
  "America/New_York",
  "America/Detroit",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Indiana/Indianapolis",
  "America/Indiana/Vincennes",
  "America/Indiana/Winamac",
  "America/Indiana/Marengo",
  "America/Indiana/Petersburg",
  "America/Indiana/Vevay",
  "America/Chicago",
  "America/Indiana/Tell_City",
  "America/Indiana/Knox",
  "America/Menominee",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/North_Dakota/Beulah",
  "America/Denver",
  "America/Boise",
  "America/Phoenix",
  "America/Los_Angeles",
  "America/Anchorage",
  "America/Juneau",
  "America/Sitka",
  "America/Metlakatla",
  "America/Yakutat",
  "America/Nome",
  "America/Adak",
  "Pacific/Honolulu",
  "America/Montevideo",
  "Asia/Samarkand",
  "Asia/Tashkent",
  "America/Caracas",
  "Asia/Ho_Chi_Minh",
  "Pacific/Efate",
  "Pacific/Wallis",
  "Pacific/Apia",
  "Africa/Johannesburg",
];
