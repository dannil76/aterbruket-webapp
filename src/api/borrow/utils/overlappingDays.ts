import { CalendarEventInput } from '../../../graphql/models';
import { isDateSameOrBetween } from '../../../utils/calendar';
import isCurrentBooking from './isCurrentBooking';

export default function overlappingDays(
    newEvent: CalendarEventInput,
    events: CalendarEventInput[],
    totalInventory: number,
): boolean {
    if (!newEvent.dateEnd || !newEvent.dateStart || !newEvent.quantity) {
        return false;
    }

    const eventEndDate = new Date(newEvent.dateEnd);
    eventEndDate.setDate(eventEndDate.getDate() + 1);
    const eventStartDate = new Date(newEvent.dateStart);
    const currentEvents = events.filter(isCurrentBooking);

    while (eventStartDate.getTime() < eventEndDate.getTime()) {
        const dateEvents = currentEvents.filter((event) => {
            return isDateSameOrBetween(
                eventStartDate,
                event.dateStart,
                event.dateEnd,
            );
        });

        const alreadyReserved = dateEvents.reduce((att, current) => {
            return att + (current.quantity ?? 1);
        }, 0);

        if (newEvent.quantity + alreadyReserved > totalInventory) {
            return true;
        }

        eventStartDate.setDate(eventStartDate.getDate() + 1);
    }

    return false;
}
