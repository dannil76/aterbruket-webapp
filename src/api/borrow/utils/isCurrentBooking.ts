import {
    BorrowStatus,
    CalendarEvent,
    CalendarEventInput,
} from '../../../graphql/models';

export default function isCurrentBooking(
    event: CalendarEvent | CalendarEventInput,
): boolean {
    const { status } = event;
    return (
        status !== BorrowStatus.cancelled && status !== BorrowStatus.returned
    );
}
