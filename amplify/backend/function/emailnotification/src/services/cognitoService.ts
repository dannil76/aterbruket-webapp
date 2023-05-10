import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { validEmail } from '../utils';
import { HaffaUser } from '../models/haffaUser';
import { Hash } from '../models/hash';

export default class CognitoService {
  userPool: CognitoIdentityServiceProvider;

  constructor() {
    this.userPool = new CognitoIdentityServiceProvider({
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

    let { email } = attributeHash;

    if (!validEmail(email)) {
      email = user.Username;
    }

    if (!validEmail(email)) {
      email = undefined;
    }

    return {
      username: user.Username,
      name: attributeHash.name,
      email,
      email_verified: attributeHash.email_verified,
      address: attributeHash.address,
      'custom:postalcode': attributeHash['custom:postalcode'],
      'custom:department': attributeHash['custom:department'],
      'custom:company': attributeHash['custom:company'],
    } as HaffaUser;
  }
}
