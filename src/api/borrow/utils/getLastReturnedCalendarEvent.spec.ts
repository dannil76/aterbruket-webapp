import { CalendarEvent } from '../../../graphql/models';
import getLastReturnedCalendarEvent from './getLastReturnedCalendarEvent';

describe('get last returned calendar event', () => {
    it('should handle undefined list', () => {
        const list = undefined as CalendarEvent[] | undefined;
        const actual = getLastReturnedCalendarEvent(list);

        expect(actual).toBeUndefined();
    });

    it('should handle empty list', () => {
        const calendarEvents = [] as CalendarEvent[];
        const actual = getLastReturnedCalendarEvent(calendarEvents);

        expect(actual).toBeUndefined();
    });

    it('should handle single Item', () => {
        const expected = {
            returnDateTime: '2022-01-10',
            status: 'returned',
        };
        const list = [expected] as CalendarEvent[];
        const actual = getLastReturnedCalendarEvent(list);

        expect(actual).toBe(expected);
    });

    it('should handle multiple items', () => {
        const expected = {
            returnDateTime: '2022-01-10',
            status: 'returned',
        };
        const list = [
            {
                returnDateTime: '2022-01-05',
                status: 'returned',
            },
            expected,
            {
                returnDateTime: '2022-01-09',
                status: 'returned',
            },
            {
                returnDateTime: '2022-01-15',
                status: 'booked',
            },
        ] as CalendarEvent[];
        const actual = getLastReturnedCalendarEvent(list);

        expect(actual).toBe(expected);
    });
});
