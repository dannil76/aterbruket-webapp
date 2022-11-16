import { CalendarEvent, CalendarEventInput } from '../../../graphql/models';

function areEqual(
    a: CalendarEventInput,
    b: CalendarEventInput | CalendarEvent,
): boolean {
    return (
        a.borrowedBySub === b.borrowedBySub &&
        a.dateEnd === b.dateEnd &&
        a.dateStart === b.dateStart &&
        a.status === b.status
    );
}

export default function removeCalendarEvent(
    events: CalendarEventInput[],
    removeEvent: CalendarEventInput | CalendarEvent,
): CalendarEventInput[] {
    return events.filter((event) => {
        return !areEqual(event, removeEvent);
    });
}
