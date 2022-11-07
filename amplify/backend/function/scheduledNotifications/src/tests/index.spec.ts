import { logDebug } from '../utils';
import { pickUpReminderHandler } from '../handlers';
import { Event } from '../models/awsEvent';
import { handler } from '..';

jest.mock('../utils', () => {
    return {
        logDebug: jest.fn(),
        logException: jest.fn(),
    };
});

jest.mock('../handlers', () => {
    return {
        pickUpReminderHandler: jest.fn(),
    };
});

describe('Scheduled notification', () => {
    let event: Event;
    const logDebugMock = logDebug as jest.Mock;
    const pickUpReminderHandlerMock = pickUpReminderHandler as jest.Mock;

    beforeEach(() => {
        logDebugMock.mockReset();
        pickUpReminderHandlerMock.mockReset();
        event = {
            triggerSource: 'user',
        } as Event;
    });

    it('handle event', async () => {
        pickUpReminderHandlerMock.mockReturnValue(Promise.resolve(true));
        await handler(event);
        expect(logDebug).toHaveBeenCalledWith(
            'Event recieved: {"triggerSource":"user"}',
        );
        expect(pickUpReminderHandlerMock).toHaveBeenCalled();
    });
});
