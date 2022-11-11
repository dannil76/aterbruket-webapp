import {
    pickUpReminderHandler,
    lateReturnHandler,
    returnReminderHandler,
} from './handlers';
import { Event } from './models';
import { logDebug } from './utils';

export async function handler(event: Event): Promise<void> {
    logDebug(`Event recieved: ${JSON.stringify(event)}`);

    const results = await Promise.all([
        pickUpReminderHandler(),
        returnReminderHandler(),
        lateReturnHandler(),
    ]);

    if (!results.every((result) => result)) {
        throw new Error(
            '[Scheduled Notification] not all e-mails succeeded. Check logs for more info',
        );
    }
}
