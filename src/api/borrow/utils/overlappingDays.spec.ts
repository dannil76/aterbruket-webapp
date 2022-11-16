import { CalendarEventInput } from '../../../graphql/models';
import overlappingDays from './overlappingDays';

describe('overlapping days', () => {
    it('should return false when list is empty', () => {
        const event = {
            dateStart: '2022-01-11',
            dateEnd: '2022-01-11',
        } as CalendarEventInput;

        const events = [] as CalendarEventInput[];
        const actual = overlappingDays(event, events);
        expect(actual).toBeFalsy();
    });

    it('should return false when after end date', () => {
        const event = {
            dateStart: '2022-01-11',
            dateEnd: '2022-01-11',
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-05',
                dateEnd: '2022-01-10',
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events);
        expect(actual).toBeFalsy();
    });

    it('should return false when before start date', () => {
        const event = {
            dateStart: '2022-01-04',
            dateEnd: '2022-01-04',
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-05',
                dateEnd: '2022-01-10',
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events);
        expect(actual).toBeFalsy();
    });

    it('should return true when on start date', () => {
        const event = {
            dateStart: '2022-01-05',
            dateEnd: '2022-01-05',
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-05',
                dateEnd: '2022-01-10',
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events);
        expect(actual).toBeTruthy();
    });

    it('should return true when on middle date', () => {
        const event = {
            dateStart: '2022-01-07',
            dateEnd: '2022-01-07',
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-05',
                dateEnd: '2022-01-10',
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events);
        expect(actual).toBeTruthy();
    });

    it('should return false when between events', () => {
        const event = {
            dateStart: '2022-01-11',
            dateEnd: '2022-01-11',
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-05',
                dateEnd: '2022-01-10',
            },
            {
                dateStart: '2022-01-12',
                dateEnd: '2022-01-15',
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events);
        expect(actual).toBeFalsy();
    });
});
