import * as AWS from 'aws-sdk';
import {
    MissingAccessory,
    ModelRecord,
    StringRecord,
    BorrowInfo,
} from '../models/awsEvent';
import { AwsUser } from './awsUser';
import { getDate, getList, getModel, getString } from './eventHelper';
import getMissingAccessoriesBody from '../templates/getMissingAccessoriesBody';
import Config from '../config';
import { logDebug, logException } from './logHelper';

const SES = new AWS.SES();
const awsUser = new AwsUser();
const config = new Config();

export async function sendMissingAccessoryNotification(
    newItem: BorrowInfo,
): Promise<boolean> {
    logDebug(`Start sendMissingAccessoryNotification.`);
    const missing = getList<ModelRecord<MissingAccessory>>(
        newItem?.missingAccessories,
    );
    const latestReport = missing.reduce((prev, curr) => {
        const previous = getModel(prev);
        const current = getModel(prev);
        const previousReportedDate = getDate(previous?.reportedDate);
        const currentReportedDate = getDate(current?.reportedDate);
        return previousReportedDate > currentReportedDate ? prev : curr;
    });

    const latest = getModel(latestReport);
    const reportedBy = getString(latest?.reportedBy);
    const lastReturnedBy = getString(latest?.lastReturnedBy);
    const accessories = getList<StringRecord>(latest?.accessories);
    const missingAccessories = accessories
        .map((accessory) => getString(accessory))
        .join(', ');

    const [reportedByUser, lastReturnedByUser] = await Promise.all([
        awsUser.getUserBySub(config.userPoolId, reportedBy),
        awsUser.getUserBySub(config.userPoolId, lastReturnedBy),
    ]);

    const body = getMissingAccessoriesBody(
        getString(newItem.title),
        getString(newItem.contactPerson),
        missingAccessories,
        reportedByUser,
        lastReturnedByUser,
    );

    const toAddress = getString(newItem?.email);
    logDebug(`Send email to ${toAddress}.`);

    try {
        await SES.sendEmail({
            Destination: {
                ToAddresses: [toAddress],
            },
            Source: config.senderDefaultEmail,
            Message: {
                Subject: { Data: 'Notis från Haffa - ett tillbehör saknas!' },
                Body: {
                    Html: { Data: body },
                },
            },
        }).promise();
    } catch (error) {
        const typedError = error as Error;
        if (typedError) {
            logException(`Send e-mail failed with ${typedError.message}`);
        }

        return false;
    }

    logDebug(`Email sent. Return true.`);
    return true;
}
