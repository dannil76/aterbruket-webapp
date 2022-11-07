import { subtractDays } from '../../utils';

describe('Subtract days from current date', () => {
    it('positive days', async () => {
        const mockDate = new Date('2022-01-06T00:00:00.000Z');
        const actual = subtractDays(mockDate, 5);
        expect(actual.toISOString()).toBe('2022-01-01T00:00:00.000Z');
    });

    it('negative days', async () => {
        const mockDate = new Date('2022-01-06T00:00:00.000Z');
        const actual = subtractDays(mockDate, -5);
        expect(actual.toISOString()).toBe('2022-01-11T00:00:00.000Z');
    });
});
