import { MissingAccessories, CalendarEvent } from '../../../graphql/models';
import updateMissingAccessories from './updateMissingAccessories';
import getLastReturnedCalendarEvent from './getLastReturnedCalendarEvent';
import { User } from '../../../contexts/UserContext';

jest.mock('./getLastReturnedCalendarEvent');

describe('update missing accessories', () => {
    const getLastReturnedCalendarEventMock =
        getLastReturnedCalendarEvent as jest.Mock;

    beforeEach(() => {
        getLastReturnedCalendarEventMock.mockReset();
    });

    it('should handle undefined lists', () => {
        const currentList = undefined as MissingAccessories[] | undefined;
        const missing = undefined as string[] | undefined;
        const calendarEvents = undefined as CalendarEvent[] | undefined;
        const user = {} as User;
        const actual = updateMissingAccessories(
            currentList,
            missing,
            calendarEvents,
            user,
        );

        expect(actual).toBeUndefined();
    });

    it('should handle empty lists', () => {
        const currentList = [] as MissingAccessories[];
        const missing = [] as string[];
        const calendarEvents = [] as CalendarEvent[];
        const user = {} as User;
        const actual = updateMissingAccessories(
            currentList,
            missing,
            calendarEvents,
            user,
        );

        expect(actual).not.toBeNull();
        expect(actual).not.toBeUndefined();
        expect(actual?.length).toBe(0);
    });

    it('should handle no new missing', () => {
        const currentList = [
            {
                accessories: ['kattborste'],
            },
        ] as MissingAccessories[];
        const missing = [] as string[];
        const calendarEvents = [] as CalendarEvent[];
        const user = {} as User;
        const actual = updateMissingAccessories(
            currentList,
            missing,
            calendarEvents,
            user,
        ) as MissingAccessories[];

        expect(actual).toBe(currentList);
        expect(actual.length).toBe(1);
        expect(actual[0].accessories[0]).toBe(currentList[0].accessories[0]);
        expect(actual[0].accessories.length).toBe(1);
    });

    it('should handle first missing before any return', () => {
        getLastReturnedCalendarEventMock.mockReturnValue(undefined);
        const expectedDate = new Date();
        const currentList = undefined as MissingAccessories[] | undefined;
        const missing = ['kattborste'] as string[];
        const calendarEvents = [] as CalendarEvent[];
        const user = {
            sub: 'abc',
        } as User;
        const actual = updateMissingAccessories(
            currentList,
            missing,
            calendarEvents,
            user,
        ) as MissingAccessories[];

        expect(actual).not.toBeUndefined();
        expect(actual.length).toBe(1);
        expect(actual[0].accessories[0]).toBe(missing[0]);
        expect(actual[0].accessories.length).toBe(1);
        expect(actual[0].reportedBy).toBe(user.sub);
        expect(actual[0].lastReturnedBy).toBe(user.sub);
        expect(new Date(actual[0].reportedDate).getUTCDate()).toBe(
            expectedDate.getUTCDate(),
        );
    });

    it('should handle first missing second borrow', () => {
        const lastReturnedEvent = {
            borrowedBySub: 'def',
        } as CalendarEvent;

        getLastReturnedCalendarEventMock.mockReturnValue(lastReturnedEvent);
        const currentList = undefined as MissingAccessories[] | undefined;
        const missing = ['kattborste'] as string[];
        const calendarEvents = [] as CalendarEvent[];
        const user = {
            sub: 'abc',
        } as User;
        const actual = updateMissingAccessories(
            currentList,
            missing,
            calendarEvents,
            user,
        ) as MissingAccessories[];

        expect(actual[0].reportedBy).toBe(user.sub);
        expect(actual[0].lastReturnedBy).toBe(lastReturnedEvent.borrowedBySub);
    });

    it('should handle additional missing items', () => {
        const lastReturnedEvent = {
            borrowedBySub: 'def',
        } as CalendarEvent;

        getLastReturnedCalendarEventMock.mockReturnValue(lastReturnedEvent);
        const expectedDate = new Date();
        const currentList = [{}] as MissingAccessories[];
        const missing = ['kattborste'] as string[];
        const calendarEvents = [] as CalendarEvent[];
        const user = {
            sub: 'abc',
        } as User;
        const actual = updateMissingAccessories(
            currentList,
            missing,
            calendarEvents,
            user,
        ) as MissingAccessories[];

        expect(actual[0]).toBe(currentList[0]);
        expect(actual[1].lastReturnedBy).toBe(lastReturnedEvent.borrowedBySub);
        expect(actual[1].reportedBy).toBe(user.sub);
        expect(new Date(actual[1].reportedDate).getUTCDate()).toBe(
            expectedDate.getUTCDate(),
        );
        expect(actual[1].accessories).toBe(missing);
    });
});
