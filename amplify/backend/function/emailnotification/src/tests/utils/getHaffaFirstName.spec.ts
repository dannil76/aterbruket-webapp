import { HaffaUser } from '../../models/haffaUser';
import getHaffaFirstName from '../../utils/getHaffaFirstName';

describe('Get string first name', () => {
    it('handle null', () => {
        const actual = getHaffaFirstName(null);
        expect(actual).toBe('');
    });

    it('handle undefined', () => {
        const actual = getHaffaFirstName(undefined);
        expect(actual).toBe('');
    });

    it('handle empty', () => {
        const actual = getHaffaFirstName('');
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

describe('Get HaffaUser no name', () => {
    const user = {} as HaffaUser;

    it('handle empty name use email instead', () => {
        user.name = '';
        user.email = 'first.last@helsingborg.se';
        const actual = getHaffaFirstName(user);
        expect(actual).toBe(user.email);
    });

    it('handle undefined name use email instead', () => {
        user.name = undefined;
        user.email = 'first.last@helsingborg.se';
        const actual = getHaffaFirstName(user);
        expect(actual).toBe(user.email);
    });

    it('handle null name use email instead', () => {
        user.name = undefined;
        user.email = 'first.last@helsingborg.se';
        const actual = getHaffaFirstName(user);
        expect(actual).toBe(user.email);
    });
});
