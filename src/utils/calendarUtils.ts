import moment, { Moment } from 'moment';
import {
    AdvertBorrowCalendar,
    BorrowStatus,
    CalendarEvent,
} from '../graphql/models';
import {
    ICalendarUpdateResult,
    ICalendarData,
    ICalendarDataEvent,
} from '../interfaces/IDateRange';

const getBorrowedQuantity = (currentDate: Date, event: CalendarEvent) => {
    // sanity check shouldn't be able to borrow without start and end dates
    if (!event.dateEnd || !event.dateStart) {
        return 0;
    }
    const dateStart = new Date(event.dateStart);
    const dateEnd = new Date(event.dateEnd);
    dateEnd.setDate(dateEnd.getDate() + 1);

    if (
        currentDate.getTime() < dateStart.getTime() ||
        currentDate.getTime() >= dateEnd.getTime()
    ) {
        return 0;
    }

    // Late return
    if (
        currentDate.getTime() >= dateEnd.getTime() &&
        event.status === 'pickedUp' &&
        currentDate.toDateString() === new Date().toDateString()
    ) {
        return event.quantity ?? 1;
    }

    return event.quantity ?? 1;
};

/**
 * Note: Dates that occur on an event with status "returned" shall be available.
 */
const isDateAvailable = (
    inputDate: Date | Moment,
    calendarData: AdvertBorrowCalendar | undefined | null,
    totalQuantity: number | null | undefined,
    requestedQuantity: number,
): boolean => {
    if (!calendarData) {
        return false;
    }

    const date = (inputDate as Moment)?.toDate() ?? (inputDate as Date);

    const dateStart = new Date(calendarData.allowedDateStart ?? '2022-01-01');
    const dateEnd = new Date(calendarData.allowedDateEnd ?? '2122-01-01');
    dateEnd.setDate(dateEnd.getDate() + 1);

    if (date.getTime() < dateStart.getTime()) {
        return false;
    }

    if (date.getTime() > dateEnd.getTime()) {
        return false;
    }

    if (
        !calendarData.calendarEvents ||
        calendarData.calendarEvents.length === 0
    ) {
        return requestedQuantity <= (totalQuantity ?? 1);
    }

    const borrowedEvents = calendarData.calendarEvents.filter((event) => {
        return (
            event.status !== BorrowStatus.returned &&
            event.status !== BorrowStatus.cancelled
        );
    });

    const borrowedQuantity = borrowedEvents.reduce(
        (acc, current) => acc + getBorrowedQuantity(date, current),
        0,
    );

    const left = (totalQuantity ?? 1) - borrowedQuantity;
    return requestedQuantity <= (left ?? 1);
};

/**
 * Events with status "returned" shall not be possible to change. This prevents edge case where a user reserved,
 * picked up, returned an item and then tried to reserv the item again on the very same day.
 */
const updateEventStatus = (
    adCalendar: ICalendarData,
    calendarEvent: CalendarEvent | null,
    newStatus: string,
): ICalendarUpdateResult => {
    const adCalendarCopy = JSON.parse(JSON.stringify(adCalendar));
    let statusUpdated: boolean;

    const foundEventIndex = adCalendarCopy.calendarEvents.findIndex(
        (event: ICalendarDataEvent) =>
            event.borrowedBySub === calendarEvent?.borrowedBySub &&
            event.dateStart === calendarEvent.dateStart &&
            event.dateEnd === calendarEvent.dateEnd &&
            event.status !== 'returned',
    );

    let currentEvent;
    if (
        foundEventIndex >= 0 &&
        adCalendarCopy.calendarEvents[foundEventIndex]
    ) {
        currentEvent = adCalendarCopy.calendarEvents[foundEventIndex];
        statusUpdated = true;
        currentEvent.status = newStatus;

        if (newStatus === 'returned') {
            currentEvent.returnDateTime = new Date().toISOString();
        }
    } else {
        statusUpdated = false;
    }

    return {
        updatedCalendarResult: adCalendarCopy,
        updateSuccessful: statusUpdated,
        currentEvent,
    };
};

const getLastReturnedCalendarEvent = (
    adCalendar: ICalendarData,
): undefined | ICalendarDataEvent => {
    const { calendarEvents } = adCalendar;

    const statusReturnedEvents = calendarEvents.filter(
        (event) => event.status === 'returned',
    );

    if (statusReturnedEvents.length < 1) {
        return undefined;
    }

    const sortedByReturnDate = statusReturnedEvents.sort((a, b) =>
        moment(a.returnDateTime)?.diff(moment(b.returnDateTime)),
    );

    return sortedByReturnDate.pop();
};

export {
    isDateAvailable,
    // addDateRangeToEvents,
    updateEventStatus,
    getLastReturnedCalendarEvent,
};
