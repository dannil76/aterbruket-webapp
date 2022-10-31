import * as AWS from 'aws-sdk';
import { HaffaUser } from '../models/haffaUser';
import { Hash } from '../models/hash';

export class AwsUser {
    userPool: AWS.CognitoIdentityServiceProvider;

    constructor() {
        this.userPool = new AWS.CognitoIdentityServiceProvider({
            apiVersion: '2016-04-18',
        });
    }

    async getUserBySub(userPoolId: string, sub: string): Promise<HaffaUser> {
        const filter = `sub = "${sub}"`;

        const listUsers = await this.userPool
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
