import { returnReminderHandler } from '../../handlers';
import { lateReturnTemplate } from '../../handlers/templates';
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
        lateReturnTemplate: jest.fn(),
    };
});

describe('Trigger return reminder', () => {
    const getBorrowedItemsMock = getBorrowedItems as jest.Mock;
    const lateReturnTemplateMock = lateReturnTemplate as jest.Mock;
    const logDebugMock = logDebug as jest.Mock;
    beforeEach(() => {
        logDebugMock.mockReset();
        lateReturnTemplateMock.mockReset();
        getBorrowedItemsMock.mockReset();
    });

    it('start handler empty response', async () => {
        getBorrowedItemsMock.mockReturnValue(Promise.resolve([]));
        const actual = await returnReminderHandler();
        expect(actual).toBe(true);
        expect(logDebug).toHaveBeenCalledWith(
            '[returnReminderHandler] handler started',
        );
    });
});
