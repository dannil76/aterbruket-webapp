import moment from 'moment';
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../graphql/mutations';
import { IAdvert, IReservation } from '../interfaces/IAdvert';
import {
    ICalendarUpdateResult,
    ICalendarData,
    ICalendarDataEvent,
    ICalendarEvent,
} from '../interfaces/IDateRange';

const isDateSameOrBetween = (
    date: moment.Moment,
    betweenDateStart: moment.MomentInput,
    betweenDateEnd: moment.MomentInput,
) => {
    return date.isBetween(betweenDateStart, betweenDateEnd, 'day', '[]');
};

/**
 * Note: Dates that occur on an event with status "returned" shall be available.
 */
const isDateAvailable = (
    date: moment.Moment,
    calendarData: ICalendarData | undefined,
): boolean => {
    if (typeof calendarData === 'undefined') {
        return true;
    }

    if (date.isBefore(moment(calendarData.allowedDateStart), 'day')) {
        return false;
    }

    if (date.isAfter(moment(calendarData.allowedDateEnd), 'day')) {
        return false;
    }

    if (calendarData.calendarEvents?.length > 0) {
        return !calendarData.calendarEvents.some((event) => {
            return (
                !(event.status === 'returned') &&
                isDateSameOrBetween(date, event.dateStart, event.dateEnd)
            );
        });
    }

    return true;
};

const addDateRangeToEvents = (
    adCalendar: ICalendarData,
    newCalendarEvent: ICalendarEvent,
    userSub: string,
): ICalendarUpdateResult => {
    const advertBorrowCalendar = JSON.parse(JSON.stringify(adCalendar));
    const calendarEvent = {
        borrowedBySub: userSub,
        dateStart: newCalendarEvent.dateRange.startDate,
        dateEnd: newCalendarEvent.dateRange.endDate,
        status: newCalendarEvent.eventType,
    };

    if (
        !newCalendarEvent.dateRange.startDate ||
        !newCalendarEvent.dateRange.endDate
    ) {
        return {
            updateSuccessful: false,
            errorMessage:
                'Datum ej valda, både start och slut datum behöver väljas.',
            updatedCalendarResult: advertBorrowCalendar,
            currentEvent: calendarEvent,
        };
    }

    const overlappingDays = adCalendar.calendarEvents.some((event) => {
        if (event.status === 'returned') {
            return false;
        }

        return (
            isDateSameOrBetween(
                moment(newCalendarEvent.dateRange.startDate),
                event.dateStart,
                event.dateEnd,
            ) ||
            isDateSameOrBetween(
                moment(newCalendarEvent.dateRange.endDate),
                event.dateStart,
                event.dateEnd,
            ) ||
            isDateSameOrBetween(
                moment(event.dateStart),
                newCalendarEvent.dateRange.startDate,
                newCalendarEvent.dateRange.endDate,
            )
        );
    });

    if (overlappingDays) {
        return {
            updateSuccessful: false,
            errorMessage:
                'Prylen kan endast bokas under en sammanhängande period.',
            updatedCalendarResult: advertBorrowCalendar,
            currentEvent: calendarEvent,
        };
    }

    advertBorrowCalendar.calendarEvents.push(calendarEvent);

    return {
        updateSuccessful: true,
        updatedCalendarResult: advertBorrowCalendar,
        currentEvent: calendarEvent,
    };
};

const updateAdvertCalendar = async (
    ad: IAdvert,
    advertBorrowCalendar: ICalendarData,
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
        }),
    );
};

/**
 * Events with status "returned" shall not be possible to change. This prevents edge case where a user reserved,
 * picked up, returned an item and then tried to reserv the item again on the very same day.
 */
const updateEventStatus = (
    adCalendar: ICalendarData,
    calendarEvent: IReservation | null,
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
    addDateRangeToEvents,
    updateAdvertCalendar,
    updateEventStatus,
    getLastReturnedCalendarEvent,
};
