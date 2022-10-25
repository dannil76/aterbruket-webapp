import * as AWS from 'aws-sdk';
import Config from '../config';
import { BorrowInfo } from '../models/awsEvent';
import createNewAdvertBody from '../templates/createNewAdvertBody';
import { getString } from './eventHelper';
import { logDebug, logException, logWarning } from './logHelper';

const SES = new AWS.SES();
const config = new Config();

export default async function sendNewAdvertNotification(
    item: BorrowInfo,
): Promise<boolean> {
    if (!config.recycleEmail || !config.appUrl || !item) {
        logWarning(
            `Missing values: recycleEmail: ${config.recycleEmail}, appUrl: ${config.appUrl}`,
        );
        return false;
    }

    const email = getString(item.email, 'email');
    const body = createNewAdvertBody(
        getString(item.id, 'id'),
        getString(item.contactPerson, 'contactPerson'),
        getString(item.department, 'department'),
        getString(item.address, 'address'),
        getString(item.postalCode, 'postalCode'),
        getString(item.phoneNumber, 'phoneNumber'),
        email,
        config.appUrl,
        getString(item.city, 'city'),
    );

    logDebug(
        `[sendNewAdvertNotification] Send e-mail 
        from '${config.senderDefaultEmail}' 
        to '${config.recycleEmail.split(',')}'`,
    );
    try {
        await SES.sendEmail({
            Destination: {
                ToAddresses: config.recycleEmail.split(','),
            },
            Source: config.senderDefaultEmail,
            Message: {
                Subject: { Data: 'Här är en QR-kod från Haffa-appen!' },
                Body: {
                    Html: { Data: body },
                },
            },
        }).promise();
    } catch (error) {
        const typedError = error as Error;
        if (typedError) {
            logException(
                `[sendNewAdvertNotification] Send e-mail failed with ${typedError.message}`,
            );
        }
        return false;
    }

    logDebug(
        `[sendNewAdvertNotification] Email has been sent to ${config.senderDefaultEmail}`,
    );
    return true;
}
