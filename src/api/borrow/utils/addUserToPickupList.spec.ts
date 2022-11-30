import { User } from '../../../contexts/UserContext';
import { Advert } from '../../../graphql/models';
import addUserToPickupList from './addUserToPickupList';

describe('Add user to pickup list', () => {
    it('should add when empty list', () => {
        const user = { sub: 'abc' } as User;
        const item = { toPickUpBySubs: [] } as unknown as Advert;
        const actual = addUserToPickupList(item, user);
        expect(actual[0]).toBe(user.sub);
        expect(item.toPickUpBySubs?.length).toBe(0);
    });

    it('should add when undefined list', () => {
        const user = { sub: 'abc' } as User;
        const item = { toPickUpBySubs: undefined } as unknown as Advert;
        const actual = addUserToPickupList(item, user);
        expect(actual[0]).toBe(user.sub);
    });

    it('should not add duplicate', () => {
        const user = { sub: 'def' } as User;
        const item = {
            toPickUpBySubs: ['abc', 'def', 'xyz'],
        } as unknown as Advert;
        const actual = addUserToPickupList(item, user);
        expect(actual.length).toBe(3);
    });
});
