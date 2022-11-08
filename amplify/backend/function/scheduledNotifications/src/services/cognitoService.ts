import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { HaffaUser, Hash } from '../models';

const userPool = new CognitoIdentityServiceProvider({
    apiVersion: '2016-04-18',
});

export default class CognitoService {
    static async getUserBySub(
        userPoolId: string,
        sub: string,
    ): Promise<HaffaUser> {
        const filter = `sub = "${sub}"`;

        const listUsers = await userPool
            .listUsers({
                UserPoolId: userPoolId,
                Filter: filter,
                Limit: 1,
            })
            .promise();

        const user = listUsers?.Users?.[0] ?? {};
        const attributes = user.Attributes ?? [];
        const attributeHash = {} as Hash<string>;

        attributes.forEach((attribute) => {
            attributeHash[attribute.Name] = attribute.Value ?? '';
        });

        return {
            username: user.Username,
            userId: sub,
            name: attributeHash.name,
            email: attributeHash.email,
            email_verified: attributeHash.email_verified,
            address: attributeHash.address,
            'custom:postalcode': attributeHash['custom:postalcode'],
            'custom:department': attributeHash['custom:department'],
            'custom:company': attributeHash['custom:company'],
        } as HaffaUser;
    }
}
