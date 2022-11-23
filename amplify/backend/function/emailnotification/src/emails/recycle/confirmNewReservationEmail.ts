import { SES } from 'aws-sdk';
import { Advert, AdvertPickUp } from '../../models/haffaAdvert';
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
    changedReservation: AdvertPickUp,
): Promise<boolean> {
    logDebug(`[confirmNewReservationEmail] Start confirmNewReservationEmail.`);

    if (changedReservation.pickedUp) {
        logDebug(
            `[confirmNewReservationEmail] reservation is picked up. Don't send confirmation mail. ID: ${newItem.id}`,
        );

        return false;
    }
    const haffaUser = await getReservedByUser(changedReservation.reservedBySub);

    if (!haffaUser) {
        logDebug(
            `[confirmNewReservationEmail] can't send e-mail missing reserved by user`,
        );

        return false;
    }

    if (!haffaUser.email) {
        logDebug(
            `[confirmNewReservationEmail] can't send e-mail missing email information ${changedReservation.reservedBySub}`,
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
        changedReservation.quantity,
        newItem.quantityUnit,
        newItem.quantity,
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
