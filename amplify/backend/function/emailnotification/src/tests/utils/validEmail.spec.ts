import validEmail from '../../utils/validEmail';

describe('Is valid email', () => {
    it('handle null', () => {
        const actual = validEmail(null);
        expect(actual).toBeFalsy();
    });

    it('handle undefined', () => {
        const actual = validEmail(undefined);
        expect(actual).toBeFalsy();
    });

    it('handle empty', () => {
        const actual = validEmail('');
        expect(actual).toBeFalsy();
    });

    it('handle single name', () => {
        const actual = validEmail('First');
        expect(actual).toBeFalsy();
    });

    it('handle full name', () => {
        const actual = validEmail('Last First');
        expect(actual).toBeFalsy();
    });

    it('handle full name with SKF', () => {
        const actual = validEmail('Last First - SKF');
        expect(actual).toBeFalsy();
    });

    it('handle partial email', () => {
        const actual = validEmail('test.testsson@helsingborg');
        expect(actual).toBeFalsy();
    });

    it('handle full email', () => {
        const actual = validEmail('test.testsson@helsingborg.se');
        expect(actual).toBeTruthy();
    });

    it('handle full email with .com', () => {
        const actual = validEmail('test.testsson@helsingborg.com');
        expect(actual).toBeTruthy();
    });
});
