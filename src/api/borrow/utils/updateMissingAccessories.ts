import { User } from '../../../contexts/UserContext';
import {
    AdvertBorrowCalendar,
    MissingAccessories,
} from '../../../graphql/models';
import getLastReturnedCalendarEvent from './getLastReturnedCalendarEvent';

export default function updateMissingAccessories(
    currentList: (MissingAccessories | null)[] | undefined | null,
    missingAccessories: string[] | undefined | null,
    advertBorrowCalendar: AdvertBorrowCalendar,
    user: User,
): (MissingAccessories | null)[] | undefined | null {
    if (!missingAccessories) {
        return currentList;
    }

    const listToUpdate = currentList ?? [];
    const lastReturned = getLastReturnedCalendarEvent(advertBorrowCalendar);

    listToUpdate.push({
        reportedBy: user.sub,
        reportedDate: new Date().toISOString(),
        accessories: missingAccessories,
        lastReturnedBy: lastReturned?.borrowedBySub ?? user.sub,
    } as MissingAccessories);

    return listToUpdate;
}
