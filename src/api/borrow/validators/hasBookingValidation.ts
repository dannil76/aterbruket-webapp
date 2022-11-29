import { User } from '../../../contexts/UserContext';
import {
    BorrowStatus,
    CalendarEvent,
    CalendarEventInput,
} from '../../../graphql/models';
import { localization } from '../../../localizations';

export default function hasBookingValidation(
    events: CalendarEventInput[] | CalendarEvent[],
    user: User,
): string | undefined {
    const userHasBooking = events.some((booking) => {
        return (
            booking.borrowedBySub === user.sub &&
            booking.status === BorrowStatus.reserved
        );
    });

    return userHasBooking ? undefined : localization.missingReservedBooking;
}
