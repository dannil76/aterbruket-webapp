import { logWarning } from "utils/logHelper";

export default class Config {
    private clientIdValue: string;

    private userPoolIdValue: string;

    private helsingborgUrlValue: string;

    private helsingborgUserRouteValue: string;

    private regionValue: string;

    constructor() {
        this.clientIdValue = process.env.CLIENT_ID ?? '';
        this.regionValue = process.env.REGION ?? '';
        this.userPoolIdValue = process.env.USER_POOL_ID ?? process.env.COGNITO_USER_POOL_ID ?? '';
        this.helsingborgUrlValue = 'intranat.helsingborg.se';
        this.helsingborgUserRouteValue = '/ad-api/user/get';
    }

    public get clientId(): string {
        if (!this.clientIdValue) {
            logWarning('Missing region')
        }

        return this.clientIdValue;
    }

    public get userPoolId(): string {
        if (!this.userPoolIdValue) {
            logWarning('Missing user pool id')
        }

        return this.userPoolIdValue;
    }

    public get helsingborgUrl(): string {
        if (!this.helsingborgUrlValue) {
            logWarning('Missing Helsingborg Url')
        }

        return this.helsingborgUrlValue;
    }

    public get helsingborgUserRoute(): string {
        if (!this.helsingborgUserRouteValue) {
            logWarning('Missing Helsingborg User Route')
        }

        return this.helsingborgUserRouteValue;
    }

    public get region(): string {
        if (!this.regionValue) {
            logWarning('Missing region')
        }

        return this.regionValue;
    }
}
