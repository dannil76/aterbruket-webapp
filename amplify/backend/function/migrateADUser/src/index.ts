/* eslint-disable no-param-reassign */
import * as AWS from 'aws-sdk';
import { Event, EventType } from './models/awsEvent';
import { createCognitoUser } from './services/cognitoService';
import { logDebug, logException } from './utils/logHelper';
import { getHelsingborgUser } from './services/helsingborgApi';
import Config from './config';

const config = new Config();
AWS.config.update({ region: config.region });

exports.handler = async function MigrateUser(event: Event): Promise<Event> {
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

    try {
        const userInfo = await getHelsingborgUser(userName, password);
        await createCognitoUser(userName, password, userInfo);

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

        return event;
    }
};
