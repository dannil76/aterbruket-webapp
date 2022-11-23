import { SES } from 'aws-sdk';
import { Advert, AdvertPickUp } from '../../models/haffaAdvert';
import {
    formatDateTime,
    getHaffaFirstName,
    getHaffaFullName,
    getReservedByUser,
    logDebug,
    logException,
} from '../../utils';
import { pickedUpTemplate } from './templates';
import Config from '../../config';

const emailService = new SES();
const config = new Config();

export default async function sendPickedUpEmail(
    newItem: Advert,
    changedReservation: AdvertPickUp,
): Promise<boolean> {
    logDebug(`[sendPickedUpEmail] Start sendPickedUpEmail.`);

    if (!changedReservation.pickedUp) {
        logDebug(
            `[sendPickedUpEmail] reservation is not picked up. Don't send picked up e-mail. ID: ${newItem.id}`,
        );

        return true;
    }

    const { title, contactPerson, id, email, updatedAt } = newItem;

    try {
        const haffaUser = await getReservedByUser(
            changedReservation.reservedBySub,
        );

        const date = formatDateTime(updatedAt);
        const body = pickedUpTemplate(
            title,
            getHaffaFirstName(contactPerson),
            getHaffaFullName(haffaUser),
            `${config.appUrl}/item/${id}`,
            haffaUser ? haffaUser['custom:department'] ?? '' : '',
            date,
            haffaUser?.email,
            changedReservation.quantity,
            newItem.quantityUnit,
            newItem.quantity,
        );

        logDebug(
            `[sendPickedUpEmail] Send email 
            from ${config.senderDefaultEmail} 
            to ${email}.`,
        );

        await emailService
            .sendEmail({
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
            })
            .promise();
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
