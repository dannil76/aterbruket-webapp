import { CalendarEventInput } from '../../../graphql/models';
import overlappingDays from './overlappingDays';

describe('overlapping days', () => {
    it('should return false when list is empty', () => {
        const event = {
            dateStart: '2022-01-11',
            dateEnd: '2022-01-11',
        } as CalendarEventInput;

        const events = [] as CalendarEventInput[];
        const actual = overlappingDays(event, events, 5);
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
        const actual = overlappingDays(event, events, 5);
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
        const actual = overlappingDays(event, events, 5);
        expect(actual).toBeFalsy();
    });

    it('should return true when on start date', () => {
        const event = {
            dateStart: '2022-01-05',
            dateEnd: '2022-01-05',
            quantity: 5,
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-05',
                dateEnd: '2022-01-10',
                quantity: 5,
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events, 5);
        expect(actual).toBeTruthy();
    });

    it('should return true when on middle date', () => {
        const event = {
            dateStart: '2022-01-07',
            dateEnd: '2022-01-07',
            quantity: 4,
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-05',
                dateEnd: '2022-01-10',
                quantity: 5,
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events, 5);
        expect(actual).toBeTruthy();
    });

    it('should return false when between events', () => {
        const event = {
            dateStart: '2022-01-11',
            dateEnd: '2022-01-11',
            quantity: 5,
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-05',
                dateEnd: '2022-01-10',
                quantity: 5,
            },
            {
                dateStart: '2022-01-12',
                dateEnd: '2022-01-15',
                quantity: 5,
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events, 5);
        expect(actual).toBeFalsy();
    });

    it('should return false when not over total quantity', () => {
        const event = {
            dateStart: '2022-01-11',
            dateEnd: '2022-01-11',
            quantity: 2,
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-09',
                dateEnd: '2022-01-12',
                quantity: 1,
            },
            {
                dateStart: '2022-01-11',
                dateEnd: '2022-01-15',
                quantity: 2,
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events, 5);
        expect(actual).toBeFalsy();
    });

    it('should return true when over total quantity single day', () => {
        const event = {
            dateStart: '2022-01-11',
            dateEnd: '2022-01-14',
            quantity: 2,
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-09',
                dateEnd: '2022-01-13',
                quantity: 1,
            },
            {
                dateStart: '2022-01-11',
                dateEnd: '2022-01-15',
                quantity: 2,
            },
            {
                dateStart: '2022-01-13',
                dateEnd: '2022-01-17',
                quantity: 2,
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events, 5);
        expect(actual).toBeTruthy();
    });

    it('should return false when missing quantity', () => {
        const event = {
            dateStart: '2022-01-29',
            dateEnd: '2022-01-30',
        } as CalendarEventInput;

        const events = [
            {
                dateStart: '2022-01-29',
                dateEnd: '2022-01-30',
                quantity: 1,
            },
        ] as CalendarEventInput[];
        const actual = overlappingDays(event, events, 1);
        expect(actual).toBeFalsy();
    });
});
