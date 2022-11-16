import { CalendarEventInput } from '../../../graphql/models';
import { isDateSameOrBetween } from '../../../utils/calendar';

export default function isEventBetweenDates(
    event: CalendarEventInput,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
): boolean {
    return (
        isDateSameOrBetween(event.dateStart, startDate, endDate) ||
        isDateSameOrBetween(event.dateEnd, startDate, endDate) ||
        isDateSameOrBetween(startDate, event.dateStart, event.dateEnd)
    );
}
