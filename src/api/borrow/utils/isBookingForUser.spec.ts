import { User } from '../../../contexts/UserContext';
import { CalendarEventInput } from '../../../graphql/models';
import isBookingForUser from './isBookingForUser';

describe('is booking for user', () => {
    it('should return true for user booking', () => {
        const user = { sub: 'abc' } as User;
        const event = { borrowedBySub: 'abc' } as CalendarEventInput;
        const actual = isBookingForUser(user)(event);
        expect(actual).toBeTruthy();
    });

    it('should return false for user booking', () => {
        const user = { sub: 'def' } as User;
        const event = { borrowedBySub: 'abc' } as CalendarEventInput;
        const actual = isBookingForUser(user)(event);
        expect(actual).toBeFalsy();
    });
});
