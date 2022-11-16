import { User } from '../../../contexts/UserContext';
import { BorrowStatus, CalendarEventInput } from '../../../graphql/models';
import isCurrentBooking from './isCurrentBooking';

describe('is booking for user', () => {
    it('should return false for cancelled', () => {
        const event = { status: BorrowStatus.cancelled } as CalendarEventInput;
        const actual = isCurrentBooking(event);
        expect(actual).toBeFalsy();
    });

    it('should return false for returned', () => {
        const event = { status: BorrowStatus.returned } as CalendarEventInput;
        const actual = isCurrentBooking(event);
        expect(actual).toBeFalsy();
    });

    it('should return true for booked', () => {
        const event = { status: BorrowStatus.booked } as CalendarEventInput;
        const actual = isCurrentBooking(event);
        expect(actual).toBeTruthy();
    });
});
