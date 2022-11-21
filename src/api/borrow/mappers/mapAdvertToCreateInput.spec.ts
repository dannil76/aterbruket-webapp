/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapAdvertToCreateInput } from '.';
import { Advert } from '../../../graphql/models';

describe('Map advert to create input', () => {
    test('standard advert', () => {
        const input = {
            id: 'abc',
            createdAt: '2022-01-01',
            updatedAt: '2022-01-01',
        } as Advert;
        const actual = mapAdvertToCreateInput(input);

        expect(actual).not.toBeNull();
        expect(actual).not.toBeUndefined();
        expect((actual as any).createdAt).toBeUndefined();
        expect((actual as any).updatedAt).toBeUndefined();
        expect(actual.version).toBe(1);
        expect(actual.id).toBe('abc');
    });

    test('standard advert with higher version', () => {
        const input = {
            id: 'abc',
            createdAt: '2022-01-01',
            updatedAt: '2022-01-01',
        } as Advert;
        const actual = mapAdvertToCreateInput(input, 4);

        expect(actual.version).toBe(5);
    });

    test('complex structure', () => {
        const input = {
            id: 'abc',
            createdAt: '2022-01-01',
            updatedAt: '2022-01-01',
            material: [{ wood: true }],
        } as Advert;
        const actual = mapAdvertToCreateInput(input, 4);
        const material = actual.material ?? [];

        expect(material[0]?.wood).toBe(true);
    });
});
