import { dayToDateString } from '.';

describe('Date to day string', () => {
    test('specified date', () => {
        const actual = dayToDateString(new Date('2022-01-02T01:01:01.000'));
        expect(actual).toBe('2022-01-02');
    });
});
