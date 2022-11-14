/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapPickUpsToInput } from '.';
import { AdvertPickUp } from '../../../graphql/models';

describe('Map advert to pickups', () => {
    test('empty list', () => {
        const actual = mapPickUpsToInput(null);

        expect(actual).not.toBeNull();
        expect(actual).not.toBeUndefined();
        expect(actual.length).toBe(0);
    });

    test('with pickups', () => {
        const pickups = [
            {
                __typename: 'AdvertPickUp',
                quantity: 4,
                reservationDate: '2022-01-01',
                reservedBySub: 'abc',
            },
        ] as AdvertPickUp[];
        const actual = mapPickUpsToInput(pickups);

        expect((actual as any).__typename).toBeUndefined();
        expect(actual.length).toBe(1);
        expect(actual[0].quantity).toBe(pickups[0].quantity);
        expect(actual[0].reservationDate).toBe(pickups[0].reservationDate);
        expect(actual[0].reservedBySub).toBe(pickups[0].reservedBySub);
    });
});
