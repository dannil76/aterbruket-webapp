import { User } from '../../../contexts/UserContext';
import { CalendarEventInput, BorrowStatus } from '../../../graphql/models';
import getUserBookings from './getUserBookings';

describe('get user bookings', () => {
    it('should handle empty list', () => {
        const user = {} as User;
        const list = [] as CalendarEventInput[];
        const actual = getUserBookings(list, user);

        expect(actual.length).toBe(0);
    });

    it('should handle one item', () => {
        const user = {
            sub: 'abc',
        } as User;
        const list = [
            {
                borrowedBySub: 'abc',
            },
        ] as CalendarEventInput[];

        const actual = getUserBookings(list, user);
        expect(actual[0]).toStrictEqual(list[0]);
    });

    it('should handle multiple items', () => {
        const user = {
            sub: 'abc',
        } as User;
        const list = [
            {
                borrowedBySub: 'def',
            },
            {
                borrowedBySub: 'abc',
            },
            {
                borrowedBySub: 'ijk',
            },
        ] as CalendarEventInput[];

        const actual = getUserBookings(list, user);
        expect(actual[0]).toStrictEqual(list[1]);
    });

    it('should handle multiple items from same user', () => {
        const user = {
            sub: 'abc',
        } as User;
        const list = [
            {
                borrowedBySub: 'abc',
                status: BorrowStatus.returned,
            },
            {
                borrowedBySub: 'abc',
                status: BorrowStatus.cancelled,
            },
            {
                borrowedBySub: 'abc',
                status: BorrowStatus.booked,
            },
        ] as CalendarEventInput[];

        const actual = getUserBookings(list, user);
        expect(actual[0]).toStrictEqual(list[2]);
    });

    it('should handle multiple items from same user all returned', () => {
        const user = {
            sub: 'abc',
        } as User;
        const list = [
            {
                borrowedBySub: 'abc',
                status: BorrowStatus.returned,
            },
            {
                borrowedBySub: 'abc',
                status: BorrowStatus.cancelled,
            },
            {
                borrowedBySub: 'abc',
                status: BorrowStatus.returned,
            },
        ] as CalendarEventInput[];

        const actual = getUserBookings(list, user);
        expect(actual.length).toStrictEqual(0);
    });
});
