import { returnReminderHandler } from '../../handlers';
import { lateReturnTemplate } from '../../handlers/templates';
import { getBorrowedItems, getPickedUpItems } from '../../services';
import { logDebug } from '../../utils';

jest.mock('../../services', () => {
    return {
        CognitoService: jest.fn(),
        sendEmail: jest.fn(),
        getPickedUpItems: jest.fn(),
    };
});

jest.mock('../../handlers/templates', () => {
    return {
        lateReturnTemplate: jest.fn(),
    };
});

describe('Trigger return reminder', () => {
    const lateReturnTemplateMock = lateReturnTemplate as jest.Mock;
    const getPickedUpItemsMock = getPickedUpItems as jest.Mock;
    const logDebugMock = logDebug as jest.Mock;
    beforeEach(() => {
        logDebugMock.mockReset();
        lateReturnTemplateMock.mockReset();
    });

    it('start handler empty response', async () => {
        getPickedUpItemsMock.mockReturnValue(Promise.resolve([]));
        const actual = await returnReminderHandler();
        expect(actual).toBe(true);
        expect(logDebug).toHaveBeenCalledWith(
            '[returnReminderHandler] handler started',
        );
    });
});
