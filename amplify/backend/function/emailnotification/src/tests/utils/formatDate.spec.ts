import { formatDateTime, formatDate } from '../../utils';

describe('Format datetimes', () => {
    it('handle null', () => {
        const actual = formatDateTime(undefined);
        expect(actual).toBe('');
    });

    it('handle correct date', () => {
        const regex = /lördag 1 januari 2022 (kl\. )?01:00/gm;
        const date = new Date('2022-01-01');
        const actual = formatDateTime(date);
        const result = actual.match(regex);
        expect(result).toBeTruthy();
    });
});

describe('Format dates', () => {
    it('handle null', () => {
        const actual = formatDateTime(undefined);
        expect(actual).toBe('');
    });

    it('handle correct date', () => {
        const date = new Date('2022-01-01');
        const actual = formatDate(date);
        expect(actual).toBe('1 januari');
    });
});
