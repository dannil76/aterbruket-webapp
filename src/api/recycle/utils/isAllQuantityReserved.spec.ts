import { AdvertPickUpInput } from '../../../graphql/models';
import isAllQuantityReserved from './isAllQuantityReserved';

describe('Check if all quantity is reserved', () => {
    test('empty list', () => {
        const actual = isAllQuantityReserved([], 10);
        expect(actual).toBeFalsy();
    });

    test('endless quantity undefined', () => {
        const input = [
            {
                quantity: 5,
            },
        ] as AdvertPickUpInput[];
        const actual = isAllQuantityReserved(input, undefined);
        expect(actual).toBeFalsy();
    });

    test('endless quantity null', () => {
        const input = [
            {
                quantity: 5,
            },
        ] as AdvertPickUpInput[];
        const actual = isAllQuantityReserved(input, null);
        expect(actual).toBeFalsy();
    });

    test('less than quantity', () => {
        const input = [
            {
                quantity: 5,
            },
        ] as AdvertPickUpInput[];
        const actual = isAllQuantityReserved(input, 10);
        expect(actual).toBeFalsy();
    });

    test('equal to quantity', () => {
        const input = [
            {
                quantity: 5,
            },
            {
                quantity: 3,
            },
            {
                quantity: 2,
            },
        ] as AdvertPickUpInput[];
        const actual = isAllQuantityReserved(input, 10);
        expect(actual).toBeTruthy();
    });

    test('more than quantity', () => {
        const input = [
            {
                quantity: 5,
            },
            {
                quantity: 3,
            },
            {
                quantity: 4,
            },
        ] as AdvertPickUpInput[];
        const actual = isAllQuantityReserved(input, 10);
        expect(actual).toBeTruthy();
    });

    test('negative quantity', () => {
        const input = [
            {
                quantity: 5,
            },
            {
                quantity: 3,
            },
            {
                quantity: 4,
            },
        ] as AdvertPickUpInput[];
        const actual = isAllQuantityReserved(input, -10);
        expect(actual).toBeTruthy();
    });

    test('zero quantity', () => {
        const input = [
            {
                quantity: 5,
            },
            {
                quantity: 3,
            },
            {
                quantity: 4,
            },
        ] as AdvertPickUpInput[];
        const actual = isAllQuantityReserved(input, 0);
        expect(actual).toBeTruthy();
    });
});
