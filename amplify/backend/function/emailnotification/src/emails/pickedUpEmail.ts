import { SES } from 'aws-sdk';
import { Advert, AdvertBorrowCalendarEvent } from '../models/haffaAdvert';
import {
    formatDate,
    getReservedByUser,
    logDebug,
    logException,
} from '../utils';
import { pickedUpEmailTemplate } from '../templates';
import Config from '../config';

const emailService = new SES();
const config = new Config();

export default async function sendPickedUpEmail(
    newItem: Advert,
    calendarEvent: AdvertBorrowCalendarEvent = undefined,
): Promise<boolean> {
    logDebug(`[sendPickedUpEmail] Start sendPickedUpEmail.`);

    // Borrowed items get user from event, recycle items get user directly from item
    const reservedBySub = calendarEvent
        ? calendarEvent.borrowedBySub
        : newItem.reservedBySub;

    const { title, contactPerson, id, email, updatedAt } = newItem;

    try {
        const haffaUser = await getReservedByUser(reservedBySub);

        const date = formatDate(updatedAt);
        const body = pickedUpEmailTemplate(
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