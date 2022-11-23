/* eslint-disable @typescript-eslint/no-explicit-any */

import { Advert } from '../../../graphql/models';
import mapAdvertToUpdateInput from './mapAdvertToUpdateInput';

describe('Map advert to pickups', () => {
    test('standard advert', () => {
        const input = {
            id: 'abc',
            createdAt: '2022-01-01',
            updatedAt: '2022-01-01',
        } as Advert;
        const actual = mapAdvertToUpdateInput(input);

        expect(actual).not.toBeNull();
        expect(actual).not.toBeUndefined();
        expect((actual as any).createdAt).toBeUndefined();
        expect((actual as any).updatedAt).toBeUndefined();
        expect(actual.id).toBe('abc');
    });

    test('complex structure', () => {
        const input = {
            id: 'abc',
            createdAt: '2022-01-01',
            updatedAt: '2022-01-01',
            material: [{ wood: true }],
        } as Advert;
        const actual = mapAdvertToUpdateInput(input);
        const material = actual.material ?? [];

        expect(material[0]?.wood).toBe(true);
    });
});
