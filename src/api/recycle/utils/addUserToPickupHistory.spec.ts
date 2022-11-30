import { User } from '../../../contexts/UserContext';
import { Advert } from '../../../graphql/models';
import addUserToPickupHistory from './addUserToPickupHistory';

describe('Add user to pickup history', () => {
    it('should add when empty list', () => {
        const user = { sub: 'abc' } as User;
        const item = { pickedUpBySubs: [] } as unknown as Advert;
        const actual = addUserToPickupHistory(item, user);
        expect(actual[0]).toBe(user.sub);
        expect(item.pickedUpBySubs?.length).toBe(0);
    });

    it('should add when undefined list', () => {
        const user = { sub: 'abc' } as User;
        const item = { pickedUpBySubs: undefined } as unknown as Advert;
        const actual = addUserToPickupHistory(item, user);
        expect(actual[0]).toBe(user.sub);
    });

    it('should not add duplicate', () => {
        const user = { sub: 'def' } as User;
        const item = {
            pickedUpBySubs: ['abc', 'def', 'xyz'],
        } as unknown as Advert;
        const actual = addUserToPickupHistory(item, user);
        expect(actual.length).toBe(3);
    });
});
