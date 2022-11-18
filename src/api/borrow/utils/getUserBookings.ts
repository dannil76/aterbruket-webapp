import { User } from '../../../contexts/UserContext';
import { CalendarEventInput } from '../../../graphql/models';
import isBookingForUser from './isBookingForUser';
import isCurrentBooking from './isCurrentBooking';

export default function getUserBookings(
    events: CalendarEventInput[],
    user: User,
): CalendarEventInput[] {
    const userReservations = events
        .filter(isCurrentBooking)
        .filter(isBookingForUser(user));

    return userReservations;
}
