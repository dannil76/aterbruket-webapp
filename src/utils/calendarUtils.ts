import moment from "moment";
import { API } from "aws-amplify";
import { graphqlOperation } from "@aws-amplify/api";
import { updateAdvert } from "../graphql/mutations";
import { IAdvert } from "../interfaces/IAdvert";
import {
  IAddDateRangeToEventsReturn,
  ICalendarData,
  ICalendarDataEvent,
  ICalendarEvent,
} from "../interfaces/IDateRange";

const isDateAvailable = (
  date: moment.Moment,
  calendarData: ICalendarData | undefined
): boolean => {
  if (typeof calendarData === "undefined") {
    return true;
  }

  if (date.isBefore(moment(calendarData.allowedDateStart), "day")) {
    return false;
  }

  if (date.isAfter(moment(calendarData.allowedDateEnd), "day")) {
    return false;
  }

  if (calendarData.calendarEvents?.length > 0) {
    return calendarData.calendarEvents.some((event) => {
      const sameOrBetween =
        date.isSameOrAfter(event.dateStart, "day") &&
        date.isSameOrBefore(event.dateEnd, "day");

      return !sameOrBetween;
    });
  }

  return true;
};

const addDateRangeToEvents = (
  adCalendar: ICalendarData,
  newCalendarEvent: ICalendarEvent,
  userSub: string
): IAddDateRangeToEventsReturn => {
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
  ad: IAdvert,
  advertBorrowCalendar: ICalendarDataEvent
): Promise<void> => {
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

export { isDateAvailable, addDateRangeToEvents, updateAdvertCalendar };
