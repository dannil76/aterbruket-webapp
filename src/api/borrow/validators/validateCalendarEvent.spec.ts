import { CalendarEventInput } from '../../../graphql/models';
import validateCalendarEvent from './validateCalendarEvent';
import overlappingDays from '../utils/overlappingDays';
import { localization } from '../../../localizations';

jest.mock('../utils/overlappingDays');

describe('validate calendar event', () => {
    it('should handle empty list', () => {
        const event = {} as CalendarEventInput;
        const actual = validateCalendarEvent(
            null,
            '2022-01-05',
            '2022-01-10',
            event,
            5,
        );

        expect(actual).toBe(localization.itemMissingCalendar);
    });

    it('should handle no start date', () => {
        const event = {
            dateEnd: '2022-01-09',
        } as CalendarEventInput;
        const events = [] as CalendarEventInput[];
        const actual = validateCalendarEvent(
            events,
            '2022-01-05',
            '2022-01-10',
            event,
            5,
        );

        expect(actual).toBe(
            'Datum ej valda, både start- och slutdatum behöver väljas.',
        );
    });

    it('should handle no end date', () => {
        const event = {
            dateStart: '2022-01-09',
        } as CalendarEventInput;
        const events = [] as CalendarEventInput[];
        const actual = validateCalendarEvent(
            events,
            '2022-01-05',
            '2022-01-10',
            event,
            5,
        );

        expect(actual).toBe(
            'Datum ej valda, både start- och slutdatum behöver väljas.',
        );
    });

    it('should not be outside borrow interval date start', () => {
        const event = {
            dateStart: '2022-01-04',
            dateEnd: '2022-01-09',
        } as CalendarEventInput;
        const events = [] as CalendarEventInput[];
        const actual = validateCalendarEvent(
            events,
            '2022-01-05',
            '2022-01-10',
            event,
            5,
        );

        expect(actual).toBe(localization.dateOutsideAdvertInterval);
    });

    it('should not be outside borrow interval date end', () => {
        const event = {
            dateStart: '2022-01-09',
            dateEnd: '2022-01-11',
        } as CalendarEventInput;
        const events = [] as CalendarEventInput[];
        const actual = validateCalendarEvent(
            events,
            '2022-01-05',
            '2022-01-10',
            event,
            5,
        );

        expect(actual).toBe(localization.dateOutsideAdvertInterval);
    });

    it('can be date start', () => {
        const event = {
            dateStart: '2022-01-05',
            dateEnd: '2022-01-05',
        } as CalendarEventInput;
        const events = [] as CalendarEventInput[];
        const actual = validateCalendarEvent(
            events,
            '2022-01-05',
            '2022-01-10',
            event,
            5,
        );

        expect(actual).toBeUndefined();
    });

    it('can be date end', () => {
        const event = {
            dateStart: '2022-01-10',
            dateEnd: '2022-01-10',
        } as CalendarEventInput;
        const events = [] as CalendarEventInput[];
        const actual = validateCalendarEvent(
            events,
            '2022-01-05',
            '2022-01-10',
            event,
            5,
        );

        expect(actual).toBeUndefined();
    });

    it('should return error when overlapping', () => {
        const mock = overlappingDays as jest.Mock;
        mock.mockReturnValue(true);
        const event = {
            dateStart: '2022-01-10',
            dateEnd: '2022-01-10',
        } as CalendarEventInput;
        const events = [] as CalendarEventInput[];
        const actual = validateCalendarEvent(
            events,
            '2022-01-05',
            '2022-01-10',
            event,
            5,
        );

        expect(actual).toBe(
            'Prylen kan endast bokas under en sammanhängande period där det finns tillräckligt antal tillgängligt.',
        );
        expect(mock).toHaveBeenCalledWith(event, events, 5);
    });

    it('should return undefined when not overlapping', () => {
        const mock = overlappingDays as jest.Mock;
        mock.mockReturnValue(false);
        const event = {
            dateStart: '2022-01-10',
            dateEnd: '2022-01-10',
        } as CalendarEventInput;
        const events = [] as CalendarEventInput[];
        const actual = validateCalendarEvent(
            events,
            '2022-01-05',
            '2022-01-10',
            event,
            5,
        );

        expect(actual).toBeUndefined();
    });
});
