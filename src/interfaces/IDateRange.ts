import moment from "moment";

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
  [key: string]: any;
}

export interface ICalendarData {
  allowedStartDate: string;
  allowedEndDate: string;
  calendarEvents: ICalendarDataEvent[];
}

export interface ICalendarDataEvent {
  borrowedBySub: string;
  status: string;
  startDate: null | string;
  endDate: null | string;
}

export interface ICalendarEvent {
  dateRange: IDateRange;
  eventType: string;
}
