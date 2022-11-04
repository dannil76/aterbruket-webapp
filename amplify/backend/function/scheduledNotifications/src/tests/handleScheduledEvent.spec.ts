import { logDebug } from '../utils';
import { getReservations } from '../services';
import { Event } from '../models/awsEvent';
import { handler } from '..';

jest.mock('../utils', () => {
    return {
        logDebug: jest.fn(),
        logException: jest.fn(),
    };
});

jest.mock('../services', () => {
    return {
        getReservations: jest.fn(),
    };
});

describe('Handle event', () => {
    let event: Event;
    const logDebugMock = logDebug as jest.Mock;
    const getReservationsMock = getReservations as jest.Mock;

    beforeEach(() => {
        logDebugMock.mockReset();
        getReservationsMock.mockReset();
        event = {
            triggerSource: 'user',
        } as Event;
    });

    it('handle event', async () => {
        getReservationsMock.mockReturnValue(Promise.resolve([]));
        await handler(event);
        expect(logDebug).toHaveBeenCalledWith(
            'Event recieved: {"triggerSource":"user"}',
        );
        expect(logDebug).toHaveBeenCalledWith('found 0 items');
    });
});
