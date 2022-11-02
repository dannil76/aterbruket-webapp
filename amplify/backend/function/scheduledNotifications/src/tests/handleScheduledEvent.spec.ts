import { logDebug } from '../utils';
import { Event } from '../models/awsEvent';
import { handler } from '..';

jest.mock('../utils/logHelper', () => {
    return {
        logDebug: jest.fn(),
    };
});

describe('Handle event', () => {
    let event: Event;

    beforeEach(() => {
        (logDebug as jest.Mock).mockReset();
        event = {
            triggerSource: 'user',
        } as Event;
    });

    it('handle event', async () => {
        await handler(event);
        expect(logDebug).toHaveBeenCalledWith(
            'Event recieved: {"triggerSource":"user"}',
        );
    });
});
