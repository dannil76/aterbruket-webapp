/* Amplify Params - DO NOT EDIT
    API_ATERBRUKETWEBAPP_GRAPHQLAPIENDPOINTOUTPUT
    API_ATERBRUKETWEBAPP_GRAPHQLAPIIDOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

import { pickUpReminderHandler } from './handlers';
import { Event } from './models';
import { logDebug } from './utils';

export async function handler(event: Event): Promise<void> {
    logDebug(`Event recieved: ${JSON.stringify(event)}`);
    const pickUpReminder = await pickUpReminderHandler();

    if (!pickUpReminder) {
        throw new Error(
            '[Scheduled Notification] not all e-mails succeeded. Check logs for more info',
        );
    }
}
