import { CognitoUser } from 'models/cognitoUser';
import { HelsingborgUser } from 'models/helsingborgUser';

export default function mapCognitoUser(
    userName: string,
    user: HelsingborgUser,
): CognitoUser {
    return {
        username: userName,
        email: user.userprincipalname,
        email_verified: 'true',
        'custom:company': user.company,
        'custom:department': user.department,
        'custom:postalcode': user.postalcode,
        'custom:newUser': 'true',
        address: user.streetaddress,
        preferred_username: userName,
    };
}
