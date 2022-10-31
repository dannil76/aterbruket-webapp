import * as AWS from 'aws-sdk';
import { Advert } from 'models/haffaAdvert';
import formatDate from 'utils/dateFormat';
import getReservedByUser from 'utils/getReservedByUser';
import template from '../templates/pickedUpEmail';
import Config from '../config';
import { logDebug, logException } from '../utils/logHelper';

const SES = new AWS.SES();
const config = new Config();

export default async function sendPickedUpEmail(
    newItem: Advert,
): Promise<boolean> {
    logDebug(`[sendPickedUpEmail] Start sendPickedUpEmail.`);
    const { title, contactPerson, id, email, updatedAt, reservedBySub } =
        newItem;

    try {
        const haffaUser = await getReservedByUser(reservedBySub);

        const date = formatDate(updatedAt);
        const body = template(
            title,
            contactPerson,
            haffaUser?.name,
            `${config.appUrl}/item/${id}`,
            haffaUser ? haffaUser['custom:department'] : undefined,
            date,
            haffaUser?.email,
        );

        logDebug(
            `[sendPickedUpEmail] Send email 
            from ${config.senderDefaultEmail} 
            to ${email}.`,
        );

        await SES.sendEmail({
            Destination: {
                ToAddresses: [email],
            },
            Source: config.senderDefaultEmail,
            Message: {
                Subject: { Data: `${title} är hämtad` },
                Body: {
                    Html: { Data: body },
                },
            },
        }).promise();
    } catch (error) {
        const typedError = error as Error;
        if (typedError) {
            logException(
                `[sendPickedUpEmail] Send e-mail 
                to ${email} 
                failed with ${typedError.message}`,
            );
        }

        return false;
    }

    logDebug(`[sendPickedUpEmail] Email sent to ${email}`);
    return true;
}
