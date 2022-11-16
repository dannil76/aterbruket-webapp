/* eslint-disable no-underscore-dangle */
import { CalendarEvent, CalendarEventInput } from '../../../graphql/models';
import mapCalendarToInput from './mapCalendarToInput';

describe('map calendar to input', () => {
    it('should handle null value', () => {
        const actual = mapCalendarToInput(null);
        expect(actual.length).toBe(0);
    });

    it('should remove type', () => {
        const event = {
            __typename: 'CalendarEvent',
            dateStart: '2022-01-05',
            dateEnd: '2022-01-05',
        } as CalendarEvent;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const actual = mapCalendarToInput([event]) as any[];
        expect(actual[0].__typename).toBeUndefined();
    });
});
