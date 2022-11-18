import { CalendarEventInput } from '../../../graphql/models';
import isCurrentBooking from './isCurrentBooking';
import isEventBetweenDates from './isEventBetweenDates';

export default function overlappingDays(
    newEvent: CalendarEventInput,
    events: CalendarEventInput[],
): boolean {
    return events.filter(isCurrentBooking).some((event) => {
        return isEventBetweenDates(newEvent, event.dateStart, event.dateEnd);
    });
}
