import getReservedByUser from '../../utils/getReservedByUser';
import { logDebug, logException } from '../../utils';
import { CognitoService } from '../../services';

jest.mock(
    '../../services',
    jest.fn(() => {
        return { CognitoService: jest.fn() };
    }),
);

jest.mock('../../utils', () => {
    return {
        logDebug: jest.fn(),
        logException: jest.fn(),
    };
});
jest.mock('../../config', () => {
    return {
        userPoolId: 'poolId',
    };
});

describe('Get reserved by user', () => {
    const logDebugMock = logDebug as jest.Mock;
    const logExceptionMock = logException as jest.Mock;

    beforeEach(() => {
        logDebugMock.mockReset();
        logExceptionMock.mockReset();
        CognitoService.getUserBySub = jest.fn();
    });

    it('by user subscription', async () => {
        const user = { username: 'haffa återbruk' };
        (CognitoService.getUserBySub as jest.Mock).mockReturnValue(
            Promise.resolve(user),
        );
        const actual = await getReservedByUser('abc');

        expect(CognitoService.getUserBySub).toHaveBeenCalled();
        expect(actual).toBe(user);
        expect(logDebug).toHaveBeenCalledWith(
            '[getReservedByUser] try get user with sub:abc',
        );
        expect(logDebug).toHaveBeenCalledWith('Found user haffa återbruk');
    });

    it('throw error', async () => {
        (CognitoService.getUserBySub as jest.Mock).mockReturnValue(
            Promise.reject(new Error('error')),
        );
        const actual = await getReservedByUser('abc');
        expect(actual).toBeUndefined();
        expect(logException).toHaveBeenCalledWith(
            '[getReservedByUser] failed get user by sub:abc from cognito: error',
        );
    });
});
