import * as AWS from 'aws-sdk';
import { Advert } from 'models/haffaAdvert';
import getReservedByUser from 'utils/getReservedByUser';
import template from '../templates/newReservationTemplate';
import Config from '../config';
import { logDebug, logException } from '../utils/logHelper';

const SES = new AWS.SES();
const config = new Config();

export default async function sendReservationEmail(
    newItem: Advert,
): Promise<boolean> {
    logDebug(`[sendReservationEmail] Start sendReservationEmail.`);

    const haffaUser = await getReservedByUser(newItem.reservedBySub);

    if (!haffaUser) {
        logDebug(
            `[sendReservationEmail] can't send e-mail missing reserved by user`,
        );

        return false;
    }

    const { title, contactPerson, id, department, email, phoneNumber } =
        newItem;
    const body = template(
        title,
        contactPerson,
        haffaUser.name,
        `${config.appUrl}/item/${id}`,
        department,
        email,
        phoneNumber,
        config.senderDefaultEmail,
    );

    const toAddress = haffaUser.email;
    logDebug(
        `[sendReservationEmail] Send email 
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
