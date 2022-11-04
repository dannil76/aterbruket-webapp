/* Amplify Params - DO NOT EDIT
    API_ATERBRUKETWEBAPP_GRAPHQLAPIENDPOINTOUTPUT
    API_ATERBRUKETWEBAPP_GRAPHQLAPIIDOUTPUT
    ENV
    REGION
Amplify Params - DO NOT EDIT */

import { getReservations } from './services';
import { Event } from './models';
import { logDebug } from './utils';

export async function handler(event: Event): Promise<void> {
    logDebug(`Event recieved: ${JSON.stringify(event)}`);
    const reservations = await getReservations();
    logDebug(`found ${reservations.length} items`);
}
