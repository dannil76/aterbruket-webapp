import { User } from '../../../contexts/UserContext';
import { CalendarEvent, MissingAccessories } from '../../../graphql/models';
import getLastReturnedCalendarEvent from './getLastReturnedCalendarEvent';

export default function updateMissingAccessories(
    currentList: MissingAccessories[] | undefined | null,
    missingAccessories: string[] | undefined | null,
    calendarEvents: CalendarEvent[] | undefined | null,
    user: User,
): MissingAccessories[] | undefined | null {
    if (!missingAccessories || missingAccessories.length === 0) {
        return currentList;
    }

    const listToUpdate = currentList ?? [];
    const lastReturned = getLastReturnedCalendarEvent(calendarEvents);

    listToUpdate.push({
        reportedBy: user.sub,
        reportedDate: new Date().toISOString(),
        accessories: missingAccessories,
        lastReturnedBy: lastReturned?.borrowedBySub ?? user.sub,
    } as MissingAccessories);

    return listToUpdate;
}
