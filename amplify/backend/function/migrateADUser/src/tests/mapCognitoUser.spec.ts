import mapper from '../utils/mapCognitoUser';
import { HelsingborgUser } from '../models/helsingborgUser';
import { CognitoUser } from '../models/cognitoUser';

describe('map helsingborg user to cognito user', () => {
    it('should return a valid cognito user', () => {
        const user = {
            company: 'company',
            department: 'department',
            displayname: 'displayname',
            postalcode: 'postalcode',
            streetaddress: 'address',
            userprincipalname: 'email',
        } as HelsingborgUser;
        const actual = mapper('name', user) as CognitoUser;

        expect(actual.address).toBe(user.streetaddress);
        expect(actual['custom:company']).toBe(user.company);
        expect(actual['custom:department']).toBe(user.department);
        expect(actual['custom:postalcode']).toBe(user.postalcode);
        expect(actual['custom:newUser']).toBe('true');
        expect(actual.email).toBe(user.userprincipalname);
        expect(actual.email_verified).toBe('true');
        expect(actual.preferred_username).toBe('name');
        expect(actual.username).toBe('name');
    });
});
