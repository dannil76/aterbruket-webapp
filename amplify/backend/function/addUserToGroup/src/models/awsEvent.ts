export interface UserAttributes {
    email_verified: string;
    preferred_username: string;
    email: string;
    'custom:company': string;
    'custom:newUser': string;
}

export interface EventRequest {
    userAttributes: UserAttributes;
}

export interface Event {
    region: string;
    userPoolId: string;
    userName: string;
    userPoolGroupName: string;
    triggerSource: string;
    request: EventRequest;
}
