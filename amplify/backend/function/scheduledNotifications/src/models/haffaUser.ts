export interface HaffaUser {
    username: string;
    userId: string;
    name: string | null | undefined;
    email: string;
    email_verified: string;
    address: string;
    'custom:postalcode': string;
    'custom:department': string;
    'custom:company': string;
}
