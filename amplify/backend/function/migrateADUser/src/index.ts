/* eslint-disable no-param-reassign */
import * as AWS from 'aws-sdk';
import getUser from './services/helsingborgApi';
import mapCognitoUser from './utils/mapCognitoUser';
import { Event, EventType } from './models/awsEvent';
import { logDebug, logException } from './utils/logHelper';
import Config from './config';

const config = new Config();
AWS.config.update({ region: config.region });

export async function handler(event: Event): Promise<Event> {
    logDebug('Event recieved');
    const { userName } = event;
    const { password } = event.request;

    if (event.triggerSource !== EventType.AUTHENTICATION) {
        logDebug(`Event type ${event.triggerSource} isn't handled.`);
        return event;
    }

    logDebug(
        `User ${event.userName} does not exist in User Pool. Attempt migration.`,
    );

    const newUser = userName.toLowerCase();

    try {
        logDebug(`Try to get user ${newUser} from Helsingborg Api`);
        const users = await getUser(newUser, password);

        if (!users || users.length === 0 || !users[0].displayname) {
            logDebug(
                `Username: ${newUser} could not be retrieved from Helsingborg Api`,
            );

            return event;
        }

        logDebug(`Retrieved ${newUser} from Helsingborg AD.`);
        const cognitoUser = mapCognitoUser(newUser, users[0]);
        event.response.userAttributes = cognitoUser;
        event.response.messageAction = 'SUPPRESS';
        event.response.finalUserStatus = 'CONFIRMED';
        return event;
    } catch (err) {
        const typedError = err as Error;
        if (typedError) {
            logException(
                `Failed to create a cognito user: ${typedError.message}`,
            );
        }

        throw err;
    }
}
