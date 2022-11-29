import { CalendarEventInput } from '../../../graphql/models';
import { localization } from '../../../localizations';
import { overlappingDays } from '../utils';

export default function validateCalendarEvent(
    calendarEvents: CalendarEventInput[] | undefined | null,
    startDate: string | undefined | null,
    endDate: string | undefined | null,
    newEvent: CalendarEventInput,
    totalQuantity: number,
): string | undefined {
    if (!calendarEvents) {
        return localization.itemMissingCalendar;
    }

    if (!newEvent.dateStart || !newEvent.dateEnd) {
        return localization.dateNotSelected;
    }

    if (
        (startDate && new Date(startDate) > new Date(newEvent.dateStart)) ||
        (endDate && new Date(endDate) < new Date(newEvent.dateEnd))
    ) {
        return localization.dateOutsideAdvertInterval;
    }

    const isOverlappingDays = overlappingDays(
        newEvent,
        calendarEvents,
        totalQuantity,
    );

    if (isOverlappingDays) {
        return localization.dateOverlap;
    }

    return undefined;
}
