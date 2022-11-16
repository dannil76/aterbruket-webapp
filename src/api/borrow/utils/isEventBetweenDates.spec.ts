import { CalendarEventInput } from '../../../graphql/models';
import isEventBetweenDates from './isEventBetweenDates';

describe('is between dates', () => {
    it('should return true when in between', () => {
        const event = {
            dateStart: '2022-01-07',
            dateEnd: '2022-01-07',
        } as CalendarEventInput;
        const actual = isEventBetweenDates(event, '2022-01-05', '2022-01-10');
        expect(actual).toBeTruthy();
    });

    it('should return true when on start date', () => {
        const event = {
            dateStart: '2022-01-05',
            dateEnd: '2022-01-05',
        } as CalendarEventInput;
        const actual = isEventBetweenDates(event, '2022-01-05', '2022-01-10');
        expect(actual).toBeTruthy();
    });

    it('should return true when on end date', () => {
        const event = {
            dateStart: '2022-01-10',
            dateEnd: '2022-01-10',
        } as CalendarEventInput;
        const actual = isEventBetweenDates(event, '2022-01-05', '2022-01-10');
        expect(actual).toBeTruthy();
    });

    it('should return true when on single date', () => {
        const event = {
            dateStart: '2022-01-05',
            dateEnd: '2022-01-05',
        } as CalendarEventInput;
        const actual = isEventBetweenDates(event, '2022-01-05', '2022-01-05');
        expect(actual).toBeTruthy();
    });

    it('should return false when after end date', () => {
        const event = {
            dateStart: '2022-01-11',
            dateEnd: '2022-01-12',
        } as CalendarEventInput;
        const actual = isEventBetweenDates(event, '2022-01-05', '2022-01-10');
        expect(actual).toBeFalsy();
    });

    it('should return false when before start date', () => {
        const event = {
            dateStart: '2022-01-02',
            dateEnd: '2022-01-04',
        } as CalendarEventInput;
        const actual = isEventBetweenDates(event, '2022-01-05', '2022-01-10');
        expect(actual).toBeFalsy();
    });
});
