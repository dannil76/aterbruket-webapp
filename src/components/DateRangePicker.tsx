import React, { useState } from 'react';
import { DateRangePicker as ReactDatesRangePicker } from 'react-dates';
import moment from 'moment';
import 'moment/locale/sv';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import {
    IDateRangePickerProps,
    IDateRangePickerHandler,
} from '../interfaces/IDateRange';

const DateRangePicker: React.FC<IDateRangePickerProps> = ({
    onValueChange,
    enabledDateRange,
    blockedDay,
    bookingType,
    initialStartDate,
    initialEndDate,
    quantity,
    ...props
}: IDateRangePickerProps) => {
    const [startDate, setStartDate] = useState<moment.Moment | null>(
        initialStartDate ? moment(initialStartDate) : null,
    );
    const [endDate, setEndDate] = useState<moment.Moment | null>(
        initialEndDate ? moment(initialEndDate) : null,
    );
    const [focusedInput, setFocusedInput] = useState<
        'startDate' | 'endDate' | null
    >(null);

    const handleDateChange = (selectedDates: IDateRangePickerHandler) => {
        setStartDate(selectedDates.startDate);
        setEndDate(selectedDates.endDate);

        const start = selectedDates.startDate?.format('YYYY-MM-DD') || null;
        const end = selectedDates.endDate?.format('YYYY-MM-DD') || null;

        onValueChange({ startDate: start, endDate: end }, bookingType);
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
            isDayBlocked={blockedDay ? blockedDay(quantity ?? 1) : undefined}
            {...props}
        />
    );
};

DateRangePicker.defaultProps = {
    numberOfMonths: 1,
};

export default DateRangePicker;
