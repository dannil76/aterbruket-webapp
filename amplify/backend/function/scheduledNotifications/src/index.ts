import { Event } from './models/awsEvent';
import { logDebug } from './utils';

export async function handler(event: Event): Promise<void> {
    logDebug(`Event recieved: ${JSON.stringify(event)}`);
}
