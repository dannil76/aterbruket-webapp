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
    logDebug(
        `[sendMissingAccessoryNotification] Start sendMissingAccessoryNotification.`,
    );
    const missing = getList<ModelRecord<MissingAccessory>>(
        newItem?.missingAccessories,
    );
    const sortedList = missing.sort((prev, curr) => {
        const previous = getModel(prev, 'previous record');
        const current = getModel(curr, 'current record');
        const previousReportedDate = getDate(
            previous?.reportedDate,
            'reportedDate',
        );
        const currentReportedDate = getDate(
            current?.reportedDate,
            'reportedDate',
        );
        return previousReportedDate.getTime() - currentReportedDate.getTime();
    });

    const dates = sortedList.map((report) =>
        getDate(
            getModel(report, 'report')?.reportedDate,
            'reportedDate',
        ).toJSON(),
    );

    logDebug(`[sendMissingAccessoryNotification] sortorder: ${dates.join()}`);

    const latestReport = sortedList[0];

    const latest = getModel(latestReport, 'latestReport');
    const reportedBy = getString(latest?.reportedBy, 'reportedBy');
    const lastReturnedBy = getString(latest?.lastReturnedBy, 'lastReturnedBy');
    const accessories = getList<StringRecord>(
        latest?.accessories,
        'accessories',
    );
    const missingAccessories = accessories
        .map((accessory) => getString(accessory, 'accessory'))
        .join(', ');

    const [reportedByUser, lastReturnedByUser] = await Promise.all([
        awsUser.getUserBySub(config.userPoolId, reportedBy),
        awsUser.getUserBySub(config.userPoolId, lastReturnedBy),
    ]);

    const body = getMissingAccessoriesBody(
        getString(newItem.title, 'title'),
        getString(newItem.contactPerson, 'contactPerson'),
        missingAccessories,
        reportedByUser,
        lastReturnedByUser,
    );

    const toAddress = getString(newItem?.email);
    logDebug(
        `[sendMissingAccessoryNotification] Send email 
        from ${config.senderDefaultEmail} 
        to ${toAddress}.`,
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
                    Html: { Data: body },
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
