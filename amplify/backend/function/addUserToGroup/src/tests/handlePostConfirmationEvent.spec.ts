import { logDebug, logException } from '../utils/logHelper';
import {
    addUserToGroup,
    updateUser,
    getUserGroups,
} from '../services/cognitoService';
import { handler } from '../index';
import { Event } from '../models/awsEvent';

jest.mock('../services/cognitoService', () => {
    return {
        addUserToGroup: jest.fn(),
        updateUser: jest.fn(),
        getUserGroups: jest.fn(),
    };
});

jest.mock('../utils/logHelper', () => {
    return {
        logDebug: jest.fn(),
        logException: jest.fn(),
        logWarning: jest.fn(),
    };
});

describe('Handle post confirmation event', () => {
    let event: Event;

    beforeEach(() => {
        (logDebug as jest.Mock).mockReset();
        (logException as jest.Mock).mockReset();
        (addUserToGroup as jest.Mock).mockReset();
        (updateUser as jest.Mock).mockReset();
        (getUserGroups as jest.Mock).mockReset();
        event = {
            userName: 'user',
            userPoolGroupName: 'pool',
            userPoolId: 'id',
            request: {
                userAttributes: {
                    'custom:newUser': 'true',
                },
            },
        } as Event;
    });

    it('handle not in group', async () => {
        (addUserToGroup as jest.Mock).mockReturnValue(Promise.resolve());
        (getUserGroups as jest.Mock).mockReturnValue(Promise.resolve([]));
        await handler(event);
        expect(addUserToGroup).toHaveBeenCalledWith(event);
        expect(updateUser).toHaveBeenCalledWith(event);
    });

    it('handle already in group', async () => {
        (addUserToGroup as jest.Mock).mockReturnValue(Promise.resolve());
        (getUserGroups as jest.Mock).mockReturnValue(Promise.resolve(['user']));
        await handler(event);
        expect(addUserToGroup).not.toHaveBeenCalled();
        expect(updateUser).toHaveBeenCalledWith(event);
    });

    it('handle failure', async () => {
        (getUserGroups as jest.Mock).mockReturnValue(Promise.resolve([]));
        (addUserToGroup as jest.Mock).mockReturnValue(
            Promise.reject(new Error('error')),
        );

        try {
            await expect(handler(event)).rejects.toThrow('error');
            expect(logException).toHaveBeenCalledWith('ERROR: error');
        } catch (error) {
            logDebug(error);
        }
    });
});
