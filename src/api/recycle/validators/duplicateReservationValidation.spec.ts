import { User } from '../../../contexts/UserContext';
import { AdvertPickUpInput } from '../../../graphql/models';
import duplicateReservationValidation from './duplicateReservationValidation';

describe('Check if there is a duplicate reservation', () => {
    const user = {
        sub: 'abc',
    } as User;

    test('empty list', () => {
        const actual = duplicateReservationValidation([], user);
        expect(actual).toBeUndefined();
    });

    test('single item', () => {
        const items = [
            {
                reservedBySub: 'abc',
                pickedUp: false,
            },
        ] as AdvertPickUpInput[];
        const actual = duplicateReservationValidation(items, user);
        expect(actual).not.toBeUndefined();
        expect(actual).toBe(
            'Du har redan en oupphämtad reservation! Ladda om sidan för att se aktuell information.',
        );
    });

    test('single item other user', () => {
        const items = [
            {
                reservedBySub: 'def',
                pickedUp: false,
            },
        ] as AdvertPickUpInput[];
        const actual = duplicateReservationValidation(items, user);
        expect(actual).toBeUndefined();
    });
});
