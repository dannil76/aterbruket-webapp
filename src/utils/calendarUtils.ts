import moment from "moment";
import { API } from "aws-amplify";
import { graphqlOperation } from "@aws-amplify/api";
import { updateAdvert } from "../graphql/mutations";
import { IAdvert, IReservation } from "../interfaces/IAdvert";
import {
  ICalendarUpdateResult,
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
    return !calendarData.calendarEvents.some((event) => {
      return date.isBetween(event.dateStart, event.dateEnd, "day", "[]");
    });
  }

  return true;
};

const addDateRangeToEvents = (
  adCalendar: ICalendarData,
  newCalendarEvent: ICalendarEvent,
  userSub: string
): ICalendarUpdateResult => {
  const advertBorrowCalendar = JSON.parse(JSON.stringify(adCalendar));
  const calendarEvent = {
    borrowedBySub: userSub,
    dateStart: newCalendarEvent.dateRange.startDate,
    dateEnd: newCalendarEvent.dateRange.endDate,
    status: newCalendarEvent.eventType,
  };

  advertBorrowCalendar.calendarEvents.push(calendarEvent);

  return {
    updateSuccessful: true,
    updatedCalendarResult: advertBorrowCalendar,
  };
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

const updateEventStatus = (
  adCalendar: ICalendarData,
  calendarEvent: IReservation | null,
  newStatus: string
): ICalendarUpdateResult => {
  const adCalendarCopy = JSON.parse(JSON.stringify(adCalendar));
  let statusUpdated: boolean;

  const foundEventIndex = adCalendarCopy.calendarEvents.findIndex(
    (el: ICalendarDataEvent) =>
      el.borrowedBySub === calendarEvent?.borrowedBySub &&
      el.dateStart === calendarEvent.dateStart &&
      el.dateEnd === calendarEvent.dateEnd
  );

  if (foundEventIndex >= 0) {
    statusUpdated = true;
    adCalendarCopy.calendarEvents[foundEventIndex].status = newStatus;
  } else {
    statusUpdated = false;
  }

  return {
    updatedCalendarResult: adCalendarCopy,
    updateSuccessful: statusUpdated,
  };
};

export {
  isDateAvailable,
  addDateRangeToEvents,
  updateAdvertCalendar,
  updateEventStatus,
};
