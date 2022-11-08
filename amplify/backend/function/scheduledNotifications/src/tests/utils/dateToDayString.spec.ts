import dateToDayString from '../../utils/dateToDayString';

describe('Date to day string', () => {
    it('format date', async () => {
        const mockDate = new Date('2022-01-06T00:00:00.000Z');
        const actual = dateToDayString(mockDate);
        expect(actual).toBe('2022-01-06');
    });
});
