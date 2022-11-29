import { User } from '../../../contexts/UserContext';
import {
    BorrowStatus,
    CalendarEvent,
    CalendarEventInput,
} from '../../../graphql/models';
import { localization } from '../../../localizations';

const bookedStatuses = [
    BorrowStatus.booked,
    BorrowStatus.reserved,
    BorrowStatus.pickedUp,
];

export default function duplicateBookingValidation(
    events: CalendarEventInput[] | CalendarEvent[],
    user: User,
): string | undefined {
    const userHasBooking = events.some((booking) => {
        return (
            booking.borrowedBySub === user.sub &&
            bookedStatuses.some((status) => {
                return booking.status === status;
            })
        );
    });

    return userHasBooking ? localization.duplicateBooking : undefined;
}
