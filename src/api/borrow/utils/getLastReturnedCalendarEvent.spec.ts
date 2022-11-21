import { AdvertBorrowCalendar, CalendarEvent } from '../../../graphql/models';
import getLastReturnedCalendarEvent from './getLastReturnedCalendarEvent';

describe('get last returned calendar event', () => {
    it('should handle undefined list', () => {
        const list = {} as AdvertBorrowCalendar;
        const actual = getLastReturnedCalendarEvent(list);

        expect(actual).toBeUndefined();
    });

    it('should handle empty list', () => {
        const list = {
            calendarEvents: [] as CalendarEvent[],
        } as AdvertBorrowCalendar;
        const actual = getLastReturnedCalendarEvent(list);

        expect(actual).toBeUndefined();
    });

    it('should handle single Item', () => {
        const expected = {
            returnDateTime: '2022-01-10',
            status: 'returned',
        };
        const list = {
            calendarEvents: [expected] as CalendarEvent[],
        } as AdvertBorrowCalendar;
        const actual = getLastReturnedCalendarEvent(list);

        expect(actual).toBe(expected);
    });

    it('should handle multiple items', () => {
        const expected = {
            returnDateTime: '2022-01-10',
            status: 'returned',
        };
        const list = {
            calendarEvents: [
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
            ] as CalendarEvent[],
        } as AdvertBorrowCalendar;
        const actual = getLastReturnedCalendarEvent(list);

        expect(actual).toBe(expected);
    });
});
