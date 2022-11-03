import { SES } from 'aws-sdk';
import { Advert } from '../../models/haffaAdvert';
import {
    getReservedByUser,
    logDebug,
    logException,
    formatDate,
    getHaffaFirstName,
    getHaffaFullName,
} from '../../utils';
import { newReservationTemplate } from './templates';
import Config from '../../config';

const emailService = new SES();
const config = new Config();

export default async function notifyAboutNewReservationEmail(
    newItem: Advert,
): Promise<boolean> {
    logDebug(
        `[notifyAboutNewReservationEmail] Start notifyAboutNewReservationEmail.`,
    );

    // Borrowed items get user from event, recycle items get user directly from item
    const { reservedBySub } = newItem;
    const haffaUser = await getReservedByUser(reservedBySub);

    const reservedDate = formatDate(newItem.updatedAt);

    if (!haffaUser) {
        logDebug(
            `[notifyAboutNewReservationEmail] can't send e-mail missing reserved by user`,
        );

        return false;
    }

    const { title, contactPerson, id, email } = newItem;
    const body = newReservationTemplate(
        title,
        getHaffaFirstName(contactPerson),
        getHaffaFullName(haffaUser),
        `${config.appUrl}/item/${id}`,
        haffaUser ? haffaUser['custom:department'] ?? '' : '',
        reservedDate,
        haffaUser?.email,
    );

    const toAddress = email;
    logDebug(
        `[notifyAboutNewReservationEmail] Send email 
        from ${config.senderDefaultEmail} 
        to ${toAddress}.`,
    );

    try {
        await emailService
            .sendEmail({
                Destination: {
                    ToAddresses: [toAddress],
                },
                Source: config.senderDefaultEmail,
                Message: {
                    Subject: { Data: `"${title}" har blivit reserverad` },
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
                `[notifyAboutNewReservationEmail] Send e-mail 
                to ${toAddress} 
                failed with ${typedError.message}`,
            );
        }

        return false;
    }

    logDebug(`[notifyAboutNewReservationEmail] Email sent to ${toAddress}`);
    return true;
}
