export interface CognitoUser {
    username: string;
    email: string;
    email_verified: string;
    preferred_username: string | undefined;
    address: string;
    'custom:postalcode': string | undefined;
    'custom:department': string | undefined;
    'custom:company': string | undefined;
    'custom:newUser': string | undefined;
}
