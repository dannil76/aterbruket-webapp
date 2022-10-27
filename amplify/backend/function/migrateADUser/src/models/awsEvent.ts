export enum EventType {
    AUTHENTICATION = 'UserMigration_Authentication',
    FORGOT = 'UserMigration_ForgotPassword',
}

export interface EventRequest {
    password: string;
}

export interface EventUserAttributes {
    email: string;
    email_verified: string;
}

export interface EventResponse {
    messageAction: string;
    finalUserStatus: string;
    userAttributes: EventUserAttributes;
}

export interface Event {
    request: EventRequest;
    response: EventResponse;
    userName: string;
    triggerSource: EventType;
}
