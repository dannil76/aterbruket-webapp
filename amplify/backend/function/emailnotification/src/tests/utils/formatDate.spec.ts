import { formatDate } from '../../utils';

describe('Format dates', () => {
    it('handle null', () => {
        const actual = formatDate(undefined);
        expect(actual).toBe('');
    });

    it('handle correct date', () => {
        const date = new Date('2022-01-01');
        const actual = formatDate(date);
        expect(actual).toBe('lördag 1 januari 2022 01:00');
    });
});
