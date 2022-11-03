import { SES } from 'aws-sdk';
import { Advert } from '../../models/haffaAdvert';
import {
    getReservedByUser,
    logDebug,
    logException,
    getHaffaFirstName,
} from '../../utils';
import { confirmReservationTemplate } from './templates';
import Config from '../../config';

const emailService = new SES();
const config = new Config();

export default async function confirmNewReservationEmail(
    newItem: Advert,
): Promise<boolean> {
    logDebug(`[confirmNewReservationEmail] Start confirmNewReservationEmail.`);

    // Borrowed items get user from event, recycle items get user directly from item
    const { reservedBySub } = newItem;
    const haffaUser = await getReservedByUser(reservedBySub);

    if (!haffaUser) {
        logDebug(
            `[confirmNewReservationEmail] can't send e-mail missing reserved by user`,
        );

        return false;
    }

    const { title, contactPerson, id, department, email, phoneNumber } =
        newItem;
    const body = confirmReservationTemplate(
        title,
        contactPerson,
        getHaffaFirstName(haffaUser),
        `${config.appUrl}/item/${id}`,
        department,
        email,
        phoneNumber,
    );

    const toAddress = haffaUser.email;
    logDebug(
        `[confirmNewReservationEmail] Send email 
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
                    Subject: { Data: `Du har reserverat "${title}"` },
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
                `[confirmNewReservationEmail] Send e-mail 
                to ${toAddress} 
                failed with ${typedError.message}`,
            );
        }

        return false;
    }

    logDebug(`[confirmNewReservationEmail] Email sent to ${toAddress}`);
    return true;
}
