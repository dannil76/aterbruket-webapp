export interface HaffaUser {
    username: string;
    name: string | null | undefined;
    email: string | undefined | null;
    email_verified: string;
    address: string;
    'custom:postalcode': string;
    'custom:department': string;
    'custom:company': string;
}
