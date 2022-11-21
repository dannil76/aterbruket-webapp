import { HaffaUser } from '../../models/haffaUser';
import getHaffaFullName from '../../utils/getHaffaFullName';

describe('Get string first name', () => {
    it('handle null', () => {
        const actual = getHaffaFullName(null);
        expect(actual).toBe('');
    });

    it('handle undefined', () => {
        const actual = getHaffaFullName(undefined);
        expect(actual).toBe('');
    });

    it('handle empty', () => {
        const actual = getHaffaFullName('');
        expect(actual).toBe('');
    });

    it('handle single name', () => {
        const actual = getHaffaFullName('First');
        expect(actual).toBe('First');
    });

    it('handle full name', () => {
        const actual = getHaffaFullName('Last First');
        expect(actual).toBe('First Last');
    });

    it('handle full name with SKF', () => {
        const actual = getHaffaFullName('Last First - SKF');
        expect(actual).toBe('First Last');
    });
});

describe('Get HaffaUser first name', () => {
    const user = {} as HaffaUser;
    it('handle empty string', () => {
        user.name = '';
        const actual = getHaffaFullName(user);
        expect(actual).toBe('');
    });

    it('handle null', () => {
        user.name = null;
        const actual = getHaffaFullName(user);
        expect(actual).toBe('');
    });

    it('handle undefined', () => {
        user.name = undefined;
        const actual = getHaffaFullName(user);
        expect(actual).toBe('');
    });

    it('handle single name', () => {
        user.name = 'First';
        const actual = getHaffaFullName(user);
        expect(actual).toBe('First');
    });

    it('handle full name', () => {
        user.name = 'Last First';
        const actual = getHaffaFullName(user);
        expect(actual).toBe('First Last');
    });

    it('handle full name with SKF', () => {
        user.name = 'Last First - SKF';
        const actual = getHaffaFullName(user);
        expect(actual).toBe('First Last');
    });
});
