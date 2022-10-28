import { handler } from '../index';
import { Event, EventType } from '../models/awsEvent';
import { HelsingborgUser } from '../models/helsingborgUser';
import { logDebug, logException } from '../utils/logHelper';

let response: Promise<HelsingborgUser[]>;
jest.mock('../services/helsingborgApi', () => {
    return {
        default: () => response,
    };
});

jest.mock('../utils/logHelper', () => {
    return {
        logDebug: jest.fn(),
        logException: jest.fn(),
        logWarning: jest.fn(),
    };
});

describe('get Helsingborg User', () => {
    const event = {
        triggerSource: EventType.AUTHENTICATION,
        userName: 'userName',
        request: {
            password: 'password',
        },
        response: {},
    } as Event;

    beforeEach(() => {
        (logDebug as jest.Mock).mockReset();
        (logException as jest.Mock).mockReset();
    });

    it('handle empty response', async () => {
        response = Promise.resolve([]);
        expect(await handler(event)).toBe(event);
        expect(logDebug).toHaveBeenCalledWith(
            'Try to get user username from Helsingborg Api',
        );
    });

    it('handle error response', async () => {
        const error = new Error('bad response');
        response = Promise.reject(error);
        await expect(handler(event)).rejects.toThrow('bad response');
        expect(logDebug).toHaveBeenCalledWith(
            'Try to get user username from Helsingborg Api',
        );
        expect(logException).toHaveBeenCalledWith(
            'Failed to create a cognito user: bad response',
        );
    });

    it('handle bad response', async () => {
        response = Promise.resolve([
            {
                displayname: undefined,
                company: undefined,
                department: undefined,
                postalcode: undefined,
                streetaddress: undefined,
                userprincipalname: undefined,
            },
        ]);
        expect(await handler(event)).toBe(event);
        expect(logDebug).toHaveBeenCalledWith(
            'Try to get user username from Helsingborg Api',
        );
    });

    it('handle good response', async () => {
        const expected = {
            displayname: 'user',
            company: undefined,
            department: undefined,
            postalcode: undefined,
            streetaddress: undefined,
            userprincipalname: undefined,
        };
        response = Promise.resolve([expected]);
        expect(await handler(event)).toBe(event);
        expect(logDebug).toHaveBeenCalledWith(
            'Try to get user username from Helsingborg Api',
        );
    });
});
