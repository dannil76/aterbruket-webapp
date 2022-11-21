import { AdvertBorrowCalendar, CalendarEvent } from '../../../graphql/models';

export default function getLastReturnedCalendarEvent(
    adCalendar: AdvertBorrowCalendar,
): undefined | CalendarEvent {
    const { calendarEvents } = adCalendar;

    if (!calendarEvents) {
        return undefined;
    }

    const returnedEvents = calendarEvents.filter(
        (event) => event.status === 'returned',
    );

    if (returnedEvents.length < 1) {
        return undefined;
    }

    const sortedByReturnDate = returnedEvents.sort(
        (a, b) =>
            new Date(a.returnDateTime ?? 0).getTime() -
            new Date(b.returnDateTime ?? 0).getTime(),
    );

    return sortedByReturnDate.pop();
}
