import { returnReminderHandler } from '../../handlers';
import { lateReturnTemplate } from '../../handlers/templates';
import { getBorrowedItems } from '../../services';
import { logDebug, sendEmailHelper } from '../../utils';

jest.mock('../../services', () => {
    return {
        CognitoService: jest.fn(),
        sendEmail: jest.fn(),
        getBorrowedItems: jest.fn(),
    };
});

jest.mock('../../handlers/templates', () => {
    return {
        lateReturnTemplate: jest.fn(),
    };
});

describe('Trigger return reminder', () => {
    const lateReturnTemplateMock = lateReturnTemplate as jest.Mock;
    const getPickedUpItemsMock = getBorrowedItems as jest.Mock;
    const sendEmailHelperMock = sendEmailHelper as jest.Mock;

    const logDebugMock = logDebug as jest.Mock;
    beforeEach(() => {
        logDebugMock.mockReset();
        lateReturnTemplateMock.mockReset();
    });

    it('start handler empty response', async () => {
        getPickedUpItemsMock.mockReturnValue(Promise.resolve([]));
        sendEmailHelperMock.mockReturnValue(Promise.resolve(true));

        const actual = await returnReminderHandler();
        expect(actual).toBe(true);
        expect(logDebug).toHaveBeenCalledWith(
            '[returnReminderHandler] handler started',
        );
    });
});
