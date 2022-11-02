import moment from 'moment';

export interface IDateRange {
    startDate: null | string;
    endDate: null | string;
}

export interface IDateRangePickerHandler {
    startDate: null | moment.Moment;
    endDate: null | moment.Moment;
}

export interface IDateRangePickerProps {
    onValueChange: (selectedDates: IDateRange, bookingType: string) => void;
    enabledDateRange?: IDateRange;
    blockedDay?: (day: moment.Moment) => boolean;
    bookingType: string;
    initialStartDate?: string;
    initialEndDate?: string;
    [key: string]: any;
}

export interface ICalendarData {
    allowedDateStart: null | string;
    allowedDateEnd: null | string;
    calendarEvents: ICalendarDataEvent[];
}

export interface ICalendarDataEvent {
    borrowedBySub: string;
    status: string;
    dateStart: null | string;
    dateEnd: null | string;
    returnDateTime?: string;
}

export interface ICalendarEvent {
    dateRange: IDateRange;
    eventType: string;
}

export interface ICalendarUpdateResult {
    updateSuccessful: boolean;
    errorMessage?: string;
    updatedCalendarResult: ICalendarData;
    currentEvent: ICalendarDataEvent | undefined;
}
