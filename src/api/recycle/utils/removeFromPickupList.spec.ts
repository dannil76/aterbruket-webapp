import { User } from '../../../contexts/UserContext';
import { AdvertPickUpInput } from '../../../graphql/models';
import removeFromPickupList from './removeFromPickupList';

describe('Unreserve from pickup list', () => {
    const user = {
        sub: 'abc',
    } as User;
    test('empty list', () => {
        const actual = removeFromPickupList([], user);
        expect(actual).not.toBeNull();
        expect(actual).not.toBeUndefined();
        expect(actual.length).toBe(0);
    });

    test('single item', () => {
        const items = [
            {
                reservedBySub: 'abc',
            },
        ] as AdvertPickUpInput[];
        const actual = removeFromPickupList(items, user);
        expect(actual).not.toBeNull();
        expect(actual).not.toBeUndefined();
        expect(actual.length).toBe(0);
    });

    test('middle item', () => {
        const items = [
            {
                reservedBySub: 'def',
                pickedUp: false,
            },
            {
                reservedBySub: 'abc',
                pickedUp: false,
            },
            {
                reservedBySub: 'hjk',
                pickedUp: false,
            },
        ] as AdvertPickUpInput[];
        const actual = removeFromPickupList(items, user);
        expect(actual.length).toBe(2);
        expect(actual[0].reservedBySub).toBe(items[0].reservedBySub);
        expect(actual[1].reservedBySub).toBe(items[2].reservedBySub);
    });

    test('not filter picked up items', () => {
        const items = [
            {
                reservedBySub: 'def',
                pickedUp: false,
            },
            {
                reservedBySub: 'abc',
                pickedUp: true,
            },
            {
                reservedBySub: 'hjk',
                pickedUp: false,
            },
            {
                reservedBySub: 'abc',
                pickedUp: false,
            },
        ] as AdvertPickUpInput[];
        const actual = removeFromPickupList(items, user);
        expect(actual.length).toBe(3);
        expect(actual[0].reservedBySub).toBe(items[0].reservedBySub);
        expect(actual[1].reservedBySub).toBe(items[1].reservedBySub);
        expect(actual[1].pickedUp).toBeTruthy();
        expect(actual[2].reservedBySub).toBe(items[2].reservedBySub);
    });
});
