import { SES } from 'aws-sdk';
import { Advert, AdvertBorrowCalendarEvent } from '../models/haffaAdvert';
import { getReservedByUser, logDebug, logException } from '../utils';
import { newReservationTemplate } from '../templates';
import Config from '../config';

const emailService = new SES();
const config = new Config();

export default async function sendReservationEmail(
    newItem: Advert,
    calendarEvent: AdvertBorrowCalendarEvent = undefined,
): Promise<boolean> {
    logDebug(`[sendReservationEmail] Start sendReservationEmail.`);

    // Borrowed items get user from event, recycle items get user directly from item
    const reservedBySub = calendarEvent
        ? calendarEvent.borrowedBySub
        : newItem.reservedBySub;
    const haffaUser = await getReservedByUser(reservedBySub);

    if (!haffaUser) {
        logDebug(
            `[sendReservationEmail] can't send e-mail missing reserved by user`,
        );

        return false;
    }

    const { title, contactPerson, id, department, email, phoneNumber } =
        newItem;
    const body = newReservationTemplate(
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
