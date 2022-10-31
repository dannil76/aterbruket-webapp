import * as AWS from 'aws-sdk';
import { Advert } from 'models/haffaAdvert';
import Config from '../config';
import template from '../templates/newAdvertTemplate';
import { logDebug, logException, logWarning } from '../utils/logHelper';

const SES = new AWS.SES();
const config = new Config();

export default async function sendNewAdvertNotification(
    item: Advert,
): Promise<boolean> {
    if (!config.recycleEmail || !config.appUrl || !item) {
        logWarning(
            `Missing values: recycleEmail: ${config.recycleEmail}, appUrl: ${config.appUrl}`,
        );
        return false;
    }

    const {
        email,
        id,
        contactPerson,
        department,
        address,
        postalCode,
        phoneNumber,
        city,
    } = item;

    const emailBody = template(
        id,
        contactPerson,
        department,
        address,
        postalCode,
        phoneNumber,
        email,
        config.appUrl,
        city,
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
                    Html: { Data: emailBody },
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
