import { AdvertPickUpInput } from '../../../graphql/models';
import reservationOverflowValidation from './reservationOverflowValidation';

describe('Check if there is a overflow', () => {
    test('empty list with all quantity', () => {
        const actual = reservationOverflowValidation([], 2, 2, 'st');
        expect(actual).toBeUndefined();
    });

    test('empty list with more than quantity', () => {
        const actual = reservationOverflowValidation([], 3, 2, 'st');
        expect(actual).not.toBeUndefined();
    });

    test('single item with equal quantity', () => {
        const items = [
            {
                reservedBySub: 'abc',
                pickedUp: false,
                quantity: 1,
            },
        ] as AdvertPickUpInput[];
        const actual = reservationOverflowValidation(items, 1, 2, 'st');
        expect(actual).toBeUndefined();
    });

    test('single item with more than quantity', () => {
        const items = [
            {
                reservedBySub: 'abc',
                pickedUp: false,
                quantity: 1,
            },
        ] as AdvertPickUpInput[];
        const actual = reservationOverflowValidation(items, 2, 2, 'st');
        expect(actual).not.toBeUndefined();
        expect(actual).toBe(
            'du försöker ta mer än det finns tillgängligt. Det finns 1st kvar. Du försökte hämta 2st. Ladda om sidan om felet kvarstår.',
        );
    });

    test('multiple item with equal to quantity', () => {
        const items = [
            {
                reservedBySub: 'abc',
                pickedUp: false,
                quantity: 1,
            },
            {
                reservedBySub: 'abc',
                pickedUp: true,
                quantity: 1,
            },
        ] as AdvertPickUpInput[];
        const actual = reservationOverflowValidation(items, 1, 3, 'st');
        expect(actual).toBeUndefined();
    });

    test('multiple item with more than quantity', () => {
        const items = [
            {
                reservedBySub: 'abc',
                pickedUp: false,
                quantity: 1,
            },
            {
                reservedBySub: 'abc',
                pickedUp: true,
                quantity: 1,
            },
        ] as AdvertPickUpInput[];
        const actual = reservationOverflowValidation(items, 2, 3, 'st');
        expect(actual).not.toBeUndefined();
    });
});
