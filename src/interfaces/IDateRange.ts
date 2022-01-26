import moment from "moment";

export interface IDateRange {
  startDate: null | moment.Moment;
  endDate: null | moment.Moment;
}

export interface IDateRangePickerProps {
  onValueChange: (selectedDates: IDateRange) => void;
  enabledDateRange?: IDateRange;
  [key: string]: any;
}
