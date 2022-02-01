import moment from "moment";
import { API } from "aws-amplify";
import { graphqlOperation } from "@aws-amplify/api";
import {
  ICalendarData,
  ICalendarDataEvent,
  ICalendarEvent,
} from "../interfaces/IDateRange";
import { updateAdvert } from "../graphql/mutations";

const isDateEnabled = (
  date: moment.Moment,
  calendarData: ICalendarData | undefined
): boolean => {
  if (typeof calendarData === "undefined") {
    return true;
  }

  if (date.isBefore(moment(calendarData.allowedStartDate))) {
    return false;
  }

  if (date.isAfter(moment(calendarData.allowedEndDate))) {
    return false;
  }

  if (calendarData.calendarEvents?.length > 0) {
    return calendarData.calendarEvents.some((event) => {
      const sameOrBetween =
        date.isSameOrAfter(event.startDate, "day") &&
        date.isSameOrBefore(event.endDate, "day");

      return !sameOrBetween;
    });
  }

  return true;
};

const addDateRangeToEvents = (
  adCalendar: ICalendarData,
  newCalendarEvent: ICalendarEvent,
  userSub: string
) => {
  const advertBorrowCalendar = JSON.parse(JSON.stringify(adCalendar));
  const calendarEvent = {
    borrowedBySub: userSub,
    dateStart: newCalendarEvent.dateRange.startDate,
    dateEnd: newCalendarEvent.dateRange.endDate,
    status: newCalendarEvent.eventType,
  };

  advertBorrowCalendar.calendarEvents.push(calendarEvent);

  return { addDateRangeToEventsResult: true, advertBorrowCalendar };
};

const updateAdvertCalendar = async (
  ad: any,
  advertBorrowCalendar: ICalendarDataEvent
) => {
  const input = {
    ...ad,
    advertBorrowCalendar,
  };

  delete input.createdAt;
  delete input.updatedAt;

  await API.graphql(
    graphqlOperation(updateAdvert, {
      input,
    })
  );
};

export { isDateEnabled, addDateRangeToEvents, updateAdvertCalendar };
