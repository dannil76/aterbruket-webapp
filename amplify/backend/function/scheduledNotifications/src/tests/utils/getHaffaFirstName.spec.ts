import { HaffaUser } from '../../models/haffaUser';
import getHaffaFirstName from '../../utils/getHaffaFirstName';

describe('Get string first name', () => {
    it('handle null', () => {
        const actual = getHaffaFirstName(undefined);
        expect(actual).toBe('');
    });

    it('handle single name', () => {
        const actual = getHaffaFirstName('First');
        expect(actual).toBe('First');
    });

    it('handle full name', () => {
        const actual = getHaffaFirstName('Last First');
        expect(actual).toBe('First');
    });

    it('handle full name with SKF', () => {
        const actual = getHaffaFirstName('Last First - SKF');
        expect(actual).toBe('First');
    });
});

describe('Get HaffaUser first name', () => {
    const user = {} as HaffaUser;
    it('handle null', () => {
        user.name = '';
        const actual = getHaffaFirstName(user);
        expect(actual).toBe('');
    });

    it('handle single name', () => {
        user.name = 'First';
        const actual = getHaffaFirstName(user);
        expect(actual).toBe('First');
    });

    it('handle full name', () => {
        user.name = 'Last First';
        const actual = getHaffaFirstName(user);
        expect(actual).toBe('First');
    });

    it('handle full name with SKF', () => {
        user.name = 'Last First - SKF';
        const actual = getHaffaFirstName(user);
        expect(actual).toBe('First');
    });
});
