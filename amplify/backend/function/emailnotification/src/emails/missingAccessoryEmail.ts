import * as AWS from 'aws-sdk';
import { Advert } from 'models/haffaAdvert';
import getReservedByUser from 'utils/getReservedByUser';
import template from '../templates/missingAccessoriesTemplate';
import Config from '../config';
import { logDebug, logException } from '../utils/logHelper';

const SES = new AWS.SES();
const config = new Config();

export async function sendMissingAccessoryNotification(
    newItem: Advert,
): Promise<boolean> {
    logDebug(
        `[sendMissingAccessoryNotification] Start sendMissingAccessoryNotification.`,
    );
    const missing = newItem?.missingAccessories;
    const sortedList = missing.sort((previous, current) => {
        const previousReportedDate = previous?.reportedDate;
        const currentReportedDate = current?.reportedDate;
        return previousReportedDate.getTime() - currentReportedDate.getTime();
    });

    const dates = sortedList.map((report) => report.reportedDate.toJSON());

    logDebug(`[sendMissingAccessoryNotification] sortorder: ${dates.join()}`);

    const latest = sortedList[0];

    const { reportedBy, lastReturnedBy, accessories } = latest;
    const missingAccessories = accessories.join(', ');

    const [reportedByUser, lastReturnedByUser] = await Promise.all([
        getReservedByUser(reportedBy),
        getReservedByUser(lastReturnedBy),
    ]);

    const emailBody = template(
        newItem.title,
        newItem.contactPerson,
        missingAccessories,
        reportedByUser,
        lastReturnedByUser,
    );

    const toAddress = newItem.email;
    logDebug(
        `[sendMissingAccessoryNotification] Send email 
        from ${config.senderDefaultEmail} 
        to ${newItem.email}.`,
    );

    try {
        await SES.sendEmail({
            Destination: {
                ToAddresses: [toAddress],
            },
            Source: config.senderDefaultEmail,
            Message: {
                Subject: { Data: 'Notis från Haffa - ett tillbehör saknas!' },
                Body: {
                    Html: { Data: emailBody },
                },
            },
        }).promise();
    } catch (error) {
        const typedError = error as Error;
        if (typedError) {
            logException(
                `[sendMissingAccessoryNotification] Send e-mail 
                to ${toAddress} 
                failed with ${typedError.message}`,
            );
        }

        return false;
    }

    logDebug(`[sendMissingAccessoryNotification] Email sent to ${toAddress}`);
    return true;
}
