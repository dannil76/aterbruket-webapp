import { CalendarEventInput } from '../../../graphql/models';
import overlappingDays from './overlappingDays';

export default function validateCalendarEvent(
    calendarEvents: CalendarEventInput[] | undefined | null,
    startDate: string | undefined | null,
    endDate: string | undefined | null,
    newEvent: CalendarEventInput,
): string | undefined {
    if (!calendarEvents) {
        return 'Saknar kalender för bokningen';
    }

    if (!newEvent.dateStart || !newEvent.dateEnd) {
        return 'Datum ej valda, både start och slut datum behöver väljas.';
    }

    if (
        (startDate && new Date(startDate) > new Date(newEvent.dateStart)) ||
        (endDate && new Date(endDate) < new Date(newEvent.dateEnd))
    ) {
        return 'Bokningen kan inte vara utanför annonsens datumintervall';
    }

    const isOverlappingDays = overlappingDays(newEvent, calendarEvents);

    if (isOverlappingDays) {
        return 'Prylen kan endast bokas under en sammanhängande period.';
    }

    return undefined;
}
