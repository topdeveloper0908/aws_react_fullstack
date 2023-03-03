import React from "react";
import {
  iterateThroughTimes,
  militaryToStandard,
  add15Minutes,
} from "../utils";

export const TimeSelect = ({ value, onChange, add15MinutesToHud }) => {
  let timesToDisplay = [];
  const timesCb = (t) => {
    timesToDisplay.push({
      value: t,
      text: militaryToStandard(add15MinutesToHud ? add15Minutes(t) : t),
    });
  };
  iterateThroughTimes("0000", "2345", timesCb);
  return (
    <select value={value} onChange={onChange} className="textInput">
      {timesToDisplay?.map((t, index) => {
        return <option key={index} value={t.value}>{t.text}</option>;
      })}
    </select>
  );
};
