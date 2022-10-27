import { logDebug, logException } from './utils/logHelper';
import { Event } from './models/awsEvent';
import {
    addUserToGroup,
    getUserGroups,
    updateUser,
} from './services/cognitoService';

export async function handler(event: Event): Promise<Event> {
    try {
        if (event.request?.userAttributes['custom:newUser'] !== 'true') {
            return event;
        }

        logDebug(`New user tries to log in: ${event.userName}`);
        const groups = await getUserGroups(event);
        if (!groups.some((group) => group === 'user')) {
            await addUserToGroup(event);
            logDebug(`User added to group: ${event.userName}`);
        }

        await updateUser(event);
        logDebug(`User is updated: ${event.userName}`);
        return event;
    } catch (err) {
        const error = err as Error;
        logException(`ERROR: ${error?.message}`);
        throw err;
    }
}
