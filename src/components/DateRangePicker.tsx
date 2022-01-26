import React, { useState } from "react";
import { DateRangePicker as ReactDatesRangePicker } from "react-dates";
import moment from "moment";
import "moment/locale/sv";
import "react-dates/lib/css/_datepicker.css";
import "react-dates/initialize";
import { IDateRangePickerProps, IDateRange } from "../interfaces/IDateRange";

const DateRangePicker: React.FC<IDateRangePickerProps> = ({
  onValueChange,
  enabledDateRange,
  ...props
}: IDateRangePickerProps) => {
  const [startDate, setStartDate] = useState<moment.Moment | null>(null);
  const [endDate, setEndDate] = useState<moment.Moment | null>(null);
  const [focusedInput, setFocusedInput] = useState<
    "startDate" | "endDate" | null
  >(null);

  const handleDateChange = (selectedDates: IDateRange) => {
    setStartDate(selectedDates.startDate);
    setEndDate(selectedDates.endDate);

    onValueChange(selectedDates);
  };

  const blockDay = (day: moment.Moment) => {
    if (typeof enabledDateRange === "undefined") {
      return false;
    }

    return !(
      day.isSameOrAfter(enabledDateRange.startDate, "day") &&
      day.isSameOrBefore(enabledDateRange.endDate, "day")
    );
  };

  return (
    <ReactDatesRangePicker
      startDate={startDate}
      startDateId="startDateId"
      endDate={endDate}
      endDateId="endDateId"
      startDatePlaceholderText="Startdatum"
      endDatePlaceholderText="Slutdatum"
      focusedInput={focusedInput}
      onFocusChange={setFocusedInput}
      onDatesChange={handleDateChange}
      hideKeyboardShortcutsPanel
      isDayBlocked={blockDay}
      {...props}
    />
  );
};

export default DateRangePicker;
