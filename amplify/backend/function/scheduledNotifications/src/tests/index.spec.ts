import { logDebug } from '../utils';
import {
    pickUpReminderHandler,
    lateReturnHandler,
    returnReminderHandler,
} from '../handlers';
import { Event } from '../models/awsEvent';
import { handler } from '..';

jest.mock('../handlers', () => {
    return {
        pickUpReminderHandler: jest.fn(),
        lateReturnHandler: jest.fn(),
        returnReminderHandler: jest.fn(),
    };
});

describe('Scheduled notification', () => {
    let event: Event;
    const logDebugMock = logDebug as jest.Mock;
    const pickUpReminderHandlerMock = pickUpReminderHandler as jest.Mock;
    const lateReturnHandlerMock = lateReturnHandler as jest.Mock;
    const returnReminderHandlerMock = returnReminderHandler as jest.Mock;

    beforeEach(() => {
        logDebugMock.mockReset();
        pickUpReminderHandlerMock.mockReset();
        lateReturnHandlerMock.mockReset();
        returnReminderHandlerMock.mockReset();
        event = {
            triggerSource: 'user',
        } as Event;
    });

    it('handle event', async () => {
        pickUpReminderHandlerMock.mockReturnValue(Promise.resolve(true));
        lateReturnHandlerMock.mockReturnValue(Promise.resolve(true));
        returnReminderHandlerMock.mockReturnValue(Promise.resolve(true));
        await handler(event);
        expect(logDebug).toHaveBeenCalledWith(
            'Event recieved: {"triggerSource":"user"}',
        );
        expect(pickUpReminderHandlerMock).toHaveBeenCalled();
    });
});
