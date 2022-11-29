import { User } from '../../../contexts/UserContext';
import { BorrowStatus, CalendarEvent } from '../../../graphql/models';
import { localization } from '../../../localizations';
import hasBookingValidation from './hasBookingValidation';

describe('Check if a reserved booking exists', () => {
    const user = {
        sub: 'abc',
    } as User;

    test('empty list', () => {
        const actual = hasBookingValidation([], user);
        expect(actual).not.toBeUndefined();
        expect(actual).toBe(localization.missingReservedBooking);
    });

    test('single item status reserved', () => {
        const items = [
            {
                borrowedBySub: 'abc',
                status: BorrowStatus.reserved,
            },
        ] as CalendarEvent[];
        const actual = hasBookingValidation(items, user);
        expect(actual).toBeUndefined();
    });

    test('single item status pickedUp', () => {
        const items = [
            {
                borrowedBySub: 'abc',
                status: BorrowStatus.pickedUp,
            },
        ] as CalendarEvent[];
        const actual = hasBookingValidation(items, user);
        expect(actual).not.toBeUndefined();
        expect(actual).toBe(localization.missingReservedBooking);
    });

    test('single item status booked', () => {
        const items = [
            {
                borrowedBySub: 'abc',
                status: BorrowStatus.booked,
            },
        ] as CalendarEvent[];
        const actual = hasBookingValidation(items, user);
        expect(actual).not.toBeUndefined();
        expect(actual).toBe(localization.missingReservedBooking);
    });

    test('single item other user', () => {
        const items = [
            {
                borrowedBySub: 'def',
                status: BorrowStatus.booked,
            },
        ] as CalendarEvent[];
        const actual = hasBookingValidation(items, user);
        expect(actual).not.toBeUndefined();
        expect(actual).toBe(localization.missingReservedBooking);
    });

    test('single item cancelled', () => {
        const items = [
            {
                borrowedBySub: 'abc',
                status: BorrowStatus.cancelled,
            },
        ] as CalendarEvent[];
        const actual = hasBookingValidation(items, user);
        expect(actual).not.toBeUndefined();
        expect(actual).toBe(localization.missingReservedBooking);
    });
});
