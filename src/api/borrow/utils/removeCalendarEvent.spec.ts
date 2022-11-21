import { CalendarEventInput, BorrowStatus } from '../../../graphql/models';
import removeCalendarEvent from './removeCalendarEvent';

describe('remove calendar event', () => {
    it('should handle empty list', () => {
        const event = {} as CalendarEventInput;
        const list = [] as CalendarEventInput[];
        const actual = removeCalendarEvent(list, event);

        expect(actual.length).toBe(0);
    });

    it('should remove when all equal', () => {
        const event = {
            borrowedBySub: 'abc',
            dateStart: '2022-01-05',
            dateEnd: '2022-01-10',
            status: BorrowStatus.pickedUp,
        } as CalendarEventInput;
        const list = [{}, event, {}] as CalendarEventInput[];
        const actual = removeCalendarEvent(list, event);

        expect(actual.length).toBe(2);
        expect(actual[0]).toBe(list[0]);
        expect(actual[1]).toBe(list[2]);
    });

    it('should not remove when not all equal', () => {
        const event = {
            borrowedBySub: 'abc',
            dateStart: '2022-01-05',
            dateEnd: '2022-01-10',
            status: BorrowStatus.pickedUp,
        } as CalendarEventInput;
        const notEvent = {
            borrowedBySub: 'abc',
            dateStart: '2022-01-06',
            dateEnd: '2022-01-10',
            status: BorrowStatus.pickedUp,
        } as CalendarEventInput;
        const list = [{}, notEvent, {}] as CalendarEventInput[];
        const actual = removeCalendarEvent(list, event);

        expect(actual.length).toBe(3);
    });
});
