import { CalendarEvent, CalendarEventInput } from '../../../graphql/models';
import { User } from '../../../contexts/UserContext';

export default function isBookingForUser(
    user: User,
): (event: CalendarEvent | CalendarEventInput) => boolean {
    return (event: CalendarEvent | CalendarEventInput) =>
        event.borrowedBySub === user.sub;
}
