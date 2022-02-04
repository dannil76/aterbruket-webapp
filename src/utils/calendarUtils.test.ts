import moment from "moment";
import { ICalendarEvent } from "../interfaces/IDateRange";
import {
  addDateRangeToEvents,
  isDateAvailable,
  updateEventStatus,
} from "./calendarUtils";

describe("Create new calendar event", () => {
  const currentDay = moment();
  const twoDaysFromToday = moment().add(2, "days");
  const sevenDaysFromToday = moment().add(7, "days");

  const userSub1 = "11111-11111-11111-11111-11111";
  const userSub2 = "22222-22222-22222-22222-22222";

  const emptyCalendarEvents = {
    allowedDateStart: currentDay.format("YYYY-MM-DD"),
    allowedDateEnd: sevenDaysFromToday.format("YYYY-MM-DD"),
    calendarEvents: [],
  };

  const singleCalendarEvent = {
    allowedDateStart: currentDay.format("YYYY-MM-DD"),
    allowedDateEnd: sevenDaysFromToday.format("YYYY-MM-DD"),
    calendarEvents: [
      {
        borrowedBySub: userSub1,
        status: "reserved",
        dateStart: currentDay.format("YYYY-MM-DD"),
        dateEnd: twoDaysFromToday.format("YYYY-MM-DD"),
      },
    ],
  };

  const eventTwoDayReservation: ICalendarEvent = {
    dateRange: {
      startDate: currentDay.format("YYYY-MM-DD"),
      endDate: twoDaysFromToday.format("YYYY-MM-DD"),
    },
    eventType: "reserved",
  };

  it("create first calendar event in empty calendar", () => {
    const expectedResult = {
      updateSuccessful: true,
      updatedCalendarResult: {
        ...emptyCalendarEvents,
        calendarEvents: [
          {
            borrowedBySub: userSub1,
            status: eventTwoDayReservation.eventType,
            dateEnd: eventTwoDayReservation.dateRange.endDate,
            dateStart: eventTwoDayReservation.dateRange.startDate,
          },
        ],
      },
    };

    const addedRangeResult = addDateRangeToEvents(
      emptyCalendarEvents,
      eventTwoDayReservation,
      userSub1
    );

    expect(addedRangeResult).toEqual(expectedResult);
  });

  it("create second calendar event", () => {
    const expectedResult = {
      updateSuccessful: true,
      updatedCalendarResult: {
        ...singleCalendarEvent,
        calendarEvents: [
          ...singleCalendarEvent.calendarEvents,
          {
            borrowedBySub: userSub2,
            status: eventTwoDayReservation.eventType,
            dateEnd: eventTwoDayReservation.dateRange.endDate,
            dateStart: eventTwoDayReservation.dateRange.startDate,
          },
        ],
      },
    };

    const addedRangeResult = addDateRangeToEvents(
      singleCalendarEvent,
      eventTwoDayReservation,
      userSub2
    );

    expect(addedRangeResult).toEqual(expectedResult);
  });
});

describe("Is date available", () => {
  it("current date between current date and tomorrow", () => {
    const result = isDateAvailable(moment(), {
      allowedDateStart: moment().format("YYYY-MM-DD"),
      allowedDateEnd: moment().add(1, "days").format("YYYY-MM-DD"),
      calendarEvents: [],
    });

    expect(result).toBeTruthy();
  });

  it("current date (today) shall not be between tomorrow and the day after tomorrow", () => {
    const result = isDateAvailable(moment(), {
      allowedDateStart: moment().add(1, "day").format("YYYY-MM-DD"),
      allowedDateEnd: moment().add(2, "days").format("YYYY-MM-DD"),
      calendarEvents: [],
    });

    expect(result).toBeFalsy();
  });

  it("only dates before and after an event shall be enabled", () => {
    const calendarData = {
      allowedDateStart: moment().format("YYYY-MM-DD"),
      allowedDateEnd: moment().add(7, "days").format("YYYY-MM-DD"),
      calendarEvents: [
        {
          borrowedBySub: "11111-11111-11111-11111-11111",
          status: "reserved",
          dateStart: moment().add(4, "days").format("YYYY-MM-DD"),
          dateEnd: moment().add(5, "days").format("YYYY-MM-DD"),
        },
      ],
    };

    expect(isDateAvailable(moment(), calendarData)).toBeTruthy();
    expect(isDateAvailable(moment().add(4, "days"), calendarData)).toBeFalsy();
    expect(isDateAvailable(moment().add(6, "days"), calendarData)).toBeTruthy();
  });

  it("calendar without events", () => {
    const calendarData = {
      allowedDateStart: moment().format("YYYY-MM-DD"),
      allowedDateEnd: moment().add(7, "days").format("YYYY-MM-DD"),
      calendarEvents: [],
    };

    expect(isDateAvailable(moment(), calendarData)).toBeTruthy();
    expect(isDateAvailable(moment().add(7, "days"), calendarData)).toBeTruthy();
  });
});

describe("Update event status", () => {
  it("change event type", () => {
    const adCalendar = {
      allowedDateStart: "2022-02-02",
      calendarEvents: [
        {
          borrowedBySub: "11111-11111-11111-11111-11111",
          dateEnd: "2022-02-03",
          dateStart: "2022-02-02",
          status: "reserved",
        },
        {
          borrowedBySub: "22222-22222-22222-22222-22222",
          dateEnd: "2022-02-05",
          dateStart: "2022-02-04",
          status: "reserved",
        },
      ],
      allowedDateEnd: "2022-02-06",
    };
    const calendarEvent = {
      borrowedBySub: "22222-22222-22222-22222-22222",
      dateEnd: "2022-02-05",
      dateStart: "2022-02-04",
      status: "reserved",
    };
    const newStatus = "pickedUp";

    const expectedResult = {
      updateSuccessful: true,
      updatedCalendarResult: {
        allowedDateEnd: "2022-02-06",
        allowedDateStart: "2022-02-02",
        calendarEvents: [
          {
            borrowedBySub: "11111-11111-11111-11111-11111",
            dateEnd: "2022-02-03",
            dateStart: "2022-02-02",
            status: "reserved",
          },
          {
            borrowedBySub: "22222-22222-22222-22222-22222",
            dateEnd: "2022-02-05",
            dateStart: "2022-02-04",
            status: "pickedUp",
          },
        ],
      },
    };

    expect(updateEventStatus(adCalendar, calendarEvent, newStatus)).toEqual(
      expectedResult
    );
  });
});
