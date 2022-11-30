import { User } from '../../../contexts/UserContext';
import { AdvertPickUpInput } from '../../../graphql/models';
import reservationExistValidation from './reservationExistValidation';

describe('Check if reservation exist', () => {
    const user = {
        sub: 'abc',
    } as User;

    test('empty list', () => {
        const actual = reservationExistValidation([], user);
        expect(actual).not.toBeUndefined();
    });

    test('single item', () => {
        const items = [
            {
                reservedBySub: 'abc',
                pickedUp: false,
            },
        ] as AdvertPickUpInput[];
        const actual = reservationExistValidation(items, user);
        expect(actual).toBeUndefined();
    });

    test('single item other user', () => {
        const items = [
            {
                reservedBySub: 'def',
                pickedUp: false,
            },
        ] as AdvertPickUpInput[];
        const actual = reservationExistValidation(items, user);
        expect(actual).not.toBeUndefined();
    });
});
