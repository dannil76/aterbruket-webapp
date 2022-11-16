/* eslint-disable @typescript-eslint/naming-convention */
import { CalendarEvent, CalendarEventInput } from '../../../graphql/models';

export default function mapCalendarToInput(
    calendarEvents: CalendarEvent[] | null | undefined,
): CalendarEventInput[] {
    if (!calendarEvents) {
        return [];
    }

    return calendarEvents.map((event) => {
        const { __typename, ...inputEvent } = { ...event };
        return inputEvent as CalendarEventInput;
    });
}
