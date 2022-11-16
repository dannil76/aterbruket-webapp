import isDateSameOrBetween from './isDateSameOrBetween';

describe('is date same or between', () => {
    it('should handle before start date', () => {
        const input = '2022-01-01';
        const startDate = '2022-01-02';
        const endDate = '2022-01-10';

        expect(isDateSameOrBetween(input, startDate, endDate)).toBeFalsy();
    });

    it('should handle after end date', () => {
        const input = '2022-01-11';
        const startDate = '2022-01-02';
        const endDate = '2022-01-10';

        expect(isDateSameOrBetween(input, startDate, endDate)).toBeFalsy();
    });

    it('should handle on start date', () => {
        const input = '2022-01-02';
        const startDate = '2022-01-02';
        const endDate = '2022-01-10';

        expect(isDateSameOrBetween(input, startDate, endDate)).toBeTruthy();
    });

    it('should handle on end date', () => {
        const input = '2022-01-10';
        const startDate = '2022-01-02';
        const endDate = '2022-01-10';

        expect(isDateSameOrBetween(input, startDate, endDate)).toBeTruthy();
    });

    it('should handle between date', () => {
        const input = '2022-01-05';
        const startDate = '2022-01-02';
        const endDate = '2022-01-10';

        expect(isDateSameOrBetween(input, startDate, endDate)).toBeTruthy();
    });

    it('should handle dates', () => {
        const input = new Date('2022-01-05');
        const startDate = new Date('2022-01-02');
        const endDate = new Date('2022-01-10');

        expect(isDateSameOrBetween(input, startDate, endDate)).toBeTruthy();
    });

    it('should handle numbers', () => {
        const input = new Date('2022-01-05').getTime();
        const startDate = new Date('2022-01-02').getTime();
        const endDate = new Date('2022-01-10').getTime();

        expect(isDateSameOrBetween(input, startDate, endDate)).toBeTruthy();
    });

    it('should handle null input', () => {
        const startDate = '2022-01-02';
        const endDate = '2022-01-10';

        expect(isDateSameOrBetween(null, startDate, endDate)).toBeFalsy();
    });

    it('should handle null startDate and endDate', () => {
        expect(isDateSameOrBetween(new Date(), null, null)).toBeTruthy();
    });
});
