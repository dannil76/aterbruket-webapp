import React, { useState } from "react";
import { DateRangePicker as ReactDatesRangePicker } from "react-dates";
import moment from "moment";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";

const DateRangePicker: React.FC = () => {
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [focusedInput, setFocusedInput] = useState<
    "startDate" | "endDate" | null
  >(null);

  return (
    <ReactDatesRangePicker
      startDate={startDate}
      startDateId="startDateId"
      endDate={endDate}
      endDateId="endDateId"
      focusedInput={focusedInput}
      onFocusChange={setFocusedInput}
      onDatesChange={(selectedDates) => {
        setStartDate(selectedDates.startDate);
        setEndDate(selectedDates.endDate);
      }}
    />
  );
};

export default DateRangePicker;
