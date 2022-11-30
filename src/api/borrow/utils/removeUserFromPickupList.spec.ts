import { User } from '../../../contexts/UserContext';
import { Advert } from '../../../graphql/models';
import removeUserFromPickupList from './removeUserFromPickupList';

describe('Remove user from pickup list', () => {
    it('should remove when empty list', () => {
        const user = { sub: 'abc' } as User;
        const item = { toPickUpBySubs: [] } as unknown as Advert;
        const actual = removeUserFromPickupList(item, user);
        expect(actual.length).toBe(0);
    });

    it('should add when undefined list', () => {
        const user = { sub: 'abc' } as User;
        const item = { toPickUpBySubs: undefined } as unknown as Advert;
        const actual = removeUserFromPickupList(item, user);
        expect(actual.length).toBe(0);
    });

    it('should not add duplicate', () => {
        const user = { sub: 'def' } as User;
        const item = {
            toPickUpBySubs: ['abc', 'def', 'xyz'],
        } as unknown as Advert;
        const actual = removeUserFromPickupList(item, user);
        expect(actual.length).toBe(2);
        expect(actual.some((sub) => sub === user.sub)).toBeFalsy();
        expect(item.toPickUpBySubs?.length).toBe(3);
    });
});
