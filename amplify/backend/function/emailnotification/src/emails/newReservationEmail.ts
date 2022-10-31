import * as AWS from 'aws-sdk';
import { Advert } from 'models/haffaAdvert';
import { AwsUser } from '../utils/awsUser';
import template from '../templates/newReservationTemplate';
import Config from '../config';
import { logDebug, logException } from '../utils/logHelper';

const SES = new AWS.SES();
const awsUser = new AwsUser();
const config = new Config();

export default async function sendReservationEmail(
    newItem: Advert,
): Promise<boolean> {
    logDebug(`[sendReservationEmail] Start sendReservationEmail.`);
    const reservationUser = await awsUser.getUserBySub(
        config.userPoolId,
        newItem.reservedBySub,
    );

    const { title, contactPerson, id, department, email, phoneNumber } =
        newItem;
    const body = template(
        title,
        contactPerson,
        reservationUser.name,
        `${config.appUrl}/item/${id}`,
        department,
        email,
        phoneNumber,
        config.senderDefaultEmail,
    );

    const toAddress = reservationUser.email;
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
                Subject: { Data: `Du har reserverat "${title}"` },
                Body: {
                    Html: { Data: body },
                },
            },
        }).promise();
    } catch (error) {
        const typedError = error as Error;
        if (typedError) {
            logException(
                `[sendReservationEmail] Send e-mail 
                to ${toAddress} 
                failed with ${typedError.message}`,
            );
        }

        return false;
    }

    logDebug(`[sendReservationEmail] Email sent to ${toAddress}`);
    return true;
}
