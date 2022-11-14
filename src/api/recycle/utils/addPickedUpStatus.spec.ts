import { User } from '../../../contexts/UserContext';
import { AdvertPickUpInput } from '../../../graphql/models';
import addPickedUpStatus from './addPickedUpStatus';

describe('Update pickUpList', () => {
    const user = {
        sub: 'abc',
    } as User;

    test('empty list', () => {
        const actual = addPickedUpStatus([], user);
        expect(actual).not.toBeNull();
        expect(actual).not.toBeUndefined();
        expect(actual.length).toBe(0);
    });

    test('single item', () => {
        const items = [
            {
                reservedBySub: 'abc',
                pickedUp: false,
            },
        ] as AdvertPickUpInput[];
        const actual = addPickedUpStatus(items, user);
        expect(actual).not.toBeNull();
        expect(actual).not.toBeUndefined();
        expect(actual.length).toBe(1);
        expect(actual[0].pickedUp).toBeTruthy();
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
        const actual = addPickedUpStatus(items, user);
        expect(actual.length).toBe(3);
        expect(actual[1].reservedBySub).toBe(items[1].reservedBySub);
        expect(actual[1].pickedUp).toBeTruthy();
        expect(actual[0].pickedUp).toBeFalsy();
        expect(actual[2].pickedUp).toBeFalsy();
    });

    test('only update not already picked up items', () => {
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
        const actual = addPickedUpStatus(items, user);
        expect(actual.length).toBe(4);
        expect(actual[0].reservedBySub).toBe(items[0].reservedBySub);
        expect(actual[0].pickedUp).toBeFalsy();
        expect(actual[1].reservedBySub).toBe(items[1].reservedBySub);
        expect(actual[1].pickedUp).toBeTruthy();
        expect(actual[2].reservedBySub).toBe(items[2].reservedBySub);
        expect(actual[2].pickedUp).toBeFalsy();
        expect(actual[3].reservedBySub).toBe(items[3].reservedBySub);
        expect(actual[3].pickedUp).toBeTruthy();
    });
});
