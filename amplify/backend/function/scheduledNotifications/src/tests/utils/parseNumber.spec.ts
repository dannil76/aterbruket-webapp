import { parseNumber } from '../../utils';

describe('Parse number no default', () => {
    it('undefined', async () => {
        const actual = parseNumber(undefined);
        expect(actual).toBe(0);
    });

    it('letters', async () => {
        const actual = parseNumber('abc');
        expect(actual).toBe(0);
    });

    it('negative values', async () => {
        const actual = parseNumber('-5');
        expect(actual).toBe(-5);
    });

    it('positive values', async () => {
        const actual = parseNumber('500');
        expect(actual).toBe(500);
    });
});

describe('Parse number with default', () => {
    it('undefined', async () => {
        const actual = parseNumber(undefined, 100);
        expect(actual).toBe(100);
    });

    it('letters', async () => {
        const actual = parseNumber('abc', 100);
        expect(actual).toBe(100);
    });

    it('negative values', async () => {
        const actual = parseNumber('-5', 100);
        expect(actual).toBe(-5);
    });

    it('positive values', async () => {
        const actual = parseNumber('500', 100);
        expect(actual).toBe(500);
    });
});
