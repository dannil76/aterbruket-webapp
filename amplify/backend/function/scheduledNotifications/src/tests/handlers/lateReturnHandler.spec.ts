import { lateReturnHandler } from '../../handlers';
import { getBorrowedItems } from '../../services';
import { logDebug } from '../../utils';

jest.mock('../../services', () => {
    return {
        getBorrowedItems: jest.fn(),
        CognitoService: jest.fn(),
        sendEmail: jest.fn(),
    };
});

jest.mock('../../handlers/templates', () => {
    return {
        returnReminderTemplate: jest.fn(),
    };
});

describe('Trigger return reminder', () => {
    const getBorrowedItemsMock = getBorrowedItems as jest.Mock;
    const logDebugMock = logDebug as jest.Mock;
    beforeEach(() => {
        logDebugMock.mockReset();
        getBorrowedItemsMock.mockReset();
    });

    it('start handler no responses', async () => {
        getBorrowedItemsMock.mockReturnValue(Promise.resolve([]));
        const actual = await lateReturnHandler();
        expect(actual).toBe(true);
        expect(logDebug).toHaveBeenCalledWith(
            '[lateReturnHandler] handler started',
        );
    });
});
