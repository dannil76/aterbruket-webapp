import { SES } from 'aws-sdk';
import { Advert, AdvertBorrowCalendarEvent } from '../models/haffaAdvert';
import {
    formatDate,
    getReservedByUser,
    logDebug,
    logException,
} from '../utils';
import { returnedEmailTemplate } from '../templates';
import Config from '../config';

const emailService = new SES();
const config = new Config();

export default async function sendReturnedEmail(
    newItem: Advert,
    calendarEvent: AdvertBorrowCalendarEvent,
): Promise<boolean> {
    logDebug(`[sendReturnedEmail] Start sendReturnedEmail.`);
    const { title, contactPerson, id, email, updatedAt } = newItem;

    try {
        const haffaUser = await getReservedByUser(calendarEvent.borrowedBySub);

        const date = formatDate(updatedAt);
        const body = returnedEmailTemplate(
            title,
            contactPerson,
            haffaUser?.name,
            `${config.appUrl}/item/${id}`,
            haffaUser ? haffaUser['custom:department'] : undefined,
            date,
            haffaUser?.email,
        );

        logDebug(
            `[sendReturnedEmail] Send email 
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
                    Subject: { Data: `${title} är återlämnad` },
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
                `[sendReturnedEmail] Send e-mail 
                to ${email} 
                failed with ${typedError.message}`,
            );
        }

        return false;
    }

    logDebug(`[sendReturnedEmail] Email sent to ${email}`);
    return true;
}
