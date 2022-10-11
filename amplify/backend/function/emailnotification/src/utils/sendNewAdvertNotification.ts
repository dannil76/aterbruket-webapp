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
        logWarning(`Missing values: recycleEmail: ${config.recycleEmail}, appUrl: ${config.appUrl}`)
        return false;
    }

    const email = getString(item.email);
    const body = createNewAdvertBody(
        getString(item.id),
        getString(item.contactPerson),
        getString(item.department),
        getString(item.address),
        getString(item.postalCode),
        getString(item.phoneNumber),
        email,
        config.appUrl,
        getString(item.city),
    );

    logDebug(`Send e-mail to ${email}`)
    try {
        await SES.sendEmail({
            Destination: {
                ToAddresses: config.recycleEmail.split(','),
            },
            Source: email,
            Message: {
                Subject: { Data: 'Här är en QR-kod från Haffa-appen!' },
                Body: {
                    Html: { Data: body },
                },
            },
        }).promise();
    }
    catch (error: any) {
        logException(`Send e-mail failed with ${error.message}`)
        return false;
    }

    logDebug(`Email has been sent.`)
    return true;
}
