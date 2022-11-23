import { AdvertPickUpInput, ItemStatus } from '../../../graphql/models';
import getUpdatedItemStatus from './getUpdatedItemStatus';

describe('Get updated advert status', () => {
    describe('endless', () => {
        test('empty list', () => {
            const actual = getUpdatedItemStatus([], 10);
            expect(actual).toBe(ItemStatus.available);
        });

        test('endless quantity undefined', () => {
            const input = [
                {
                    quantity: 5,
                    pickedUp: true,
                },
            ] as AdvertPickUpInput[];
            const actual = getUpdatedItemStatus(input, undefined);
            expect(actual).toBe(ItemStatus.available);
        });

        test('endless quantity null', () => {
            const input = [
                {
                    quantity: 5,
                    pickedUp: true,
                },
            ] as AdvertPickUpInput[];
            const actual = getUpdatedItemStatus(input, null);
            expect(actual).toBe(ItemStatus.available);
        });

        test('zero quantity', () => {
            const input = [
                {
                    quantity: 5,
                    pickedUp: true,
                },
                {
                    quantity: 3,
                    pickedUp: true,
                },
                {
                    quantity: 4,
                    pickedUp: true,
                },
            ] as AdvertPickUpInput[];
            const actual = getUpdatedItemStatus(input, 0);
            expect(actual).toBe(ItemStatus.available);
        });

        test('negative quantity', () => {
            const input = [
                {
                    quantity: 5,
                    pickedUp: true,
                },
                {
                    quantity: 3,
                    pickedUp: true,
                },
                {
                    quantity: 4,
                    pickedUp: true,
                },
            ] as AdvertPickUpInput[];
            const actual = getUpdatedItemStatus(input, -10);
            expect(actual).toBe(ItemStatus.available);
        });
    });

    describe('picked up', () => {
        test('less than quantity', () => {
            const input = [
                {
                    quantity: 5,
                    pickedUp: true,
                },
            ] as AdvertPickUpInput[];
            const actual = getUpdatedItemStatus(input, 10);
            expect(actual).toBe(ItemStatus.available);
        });

        test('equal to quantity', () => {
            const input = [
                {
                    quantity: 5,
                    pickedUp: true,
                },
                {
                    quantity: 3,
                    pickedUp: true,
                },
                {
                    quantity: 2,
                    pickedUp: true,
                },
            ] as AdvertPickUpInput[];
            const actual = getUpdatedItemStatus(input, 10);
            expect(actual).toBe(ItemStatus.pickedUp);
        });

        test('more than quantity', () => {
            const input = [
                {
                    quantity: 5,
                    pickedUp: true,
                },
                {
                    quantity: 3,
                    pickedUp: true,
                },
                {
                    quantity: 4,
                    pickedUp: true,
                },
            ] as AdvertPickUpInput[];
            const actual = getUpdatedItemStatus(input, 10);
            expect(actual).toBe(ItemStatus.pickedUp);
        });
    });

    describe('reserved', () => {
        test('less than quantity', () => {
            const input = [
                {
                    quantity: 5,
                    pickedUp: false,
                },
            ] as AdvertPickUpInput[];
            const actual = getUpdatedItemStatus(input, 10);
            expect(actual).toBe(ItemStatus.available);
        });

        test('equal to quantity', () => {
            const input = [
                {
                    quantity: 5,
                    pickedUp: false,
                },
                {
                    quantity: 3,
                    pickedUp: true,
                },
                {
                    quantity: 2,
                    pickedUp: true,
                },
            ] as AdvertPickUpInput[];
            const actual = getUpdatedItemStatus(input, 10);
            expect(actual).toBe(ItemStatus.reserved);
        });

        test('more than quantity', () => {
            const input = [
                {
                    quantity: 5,
                    pickedUp: false,
                },
                {
                    quantity: 3,
                    pickedUp: false,
                },
                {
                    quantity: 4,
                    pickedUp: true,
                },
            ] as AdvertPickUpInput[];
            const actual = getUpdatedItemStatus(input, 10);
            expect(actual).toBe(ItemStatus.reserved);
        });
    });
});
