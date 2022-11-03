import { HaffaUser } from '../../models/haffaUser';
import { getHaffaFullName } from '../../utils';

describe('Get string first name', () => {
    it('handle null', () => {
        const actual = getHaffaFullName(undefined);
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
    it('handle null', () => {
        user.name = '';
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
