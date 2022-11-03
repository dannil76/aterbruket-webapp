import { SES } from 'aws-sdk';
import { Advert, AdvertBorrowCalendarEvent } from '../../models/haffaAdvert';
import {
    formatDate,
    getHaffaFirstName,
    getHaffaFullName,
    getReservedByUser,
    logDebug,
    logException,
} from '../../utils';
import { borrowedTemplate } from './templates';
import Config from '../../config';

const emailService = new SES();
const config = new Config();

export default async function borrowedEmail(
    newItem: Advert,
    calendarEvent: AdvertBorrowCalendarEvent,
): Promise<boolean> {
    logDebug(`[borrowedEmail] Start borrowedEmail.`);

    // Borrowed items get user from event, recycle items get user directly from item
    const reservedBySub = calendarEvent.borrowedBySub;

    const { title, contactPerson, id, email } = newItem;

    try {
        const haffaUser = await getReservedByUser(reservedBySub);
        const borrowerFirstName = getHaffaFirstName(haffaUser);
        const contactPersonFirstName = getHaffaFirstName(contactPerson);

        const body = borrowedTemplate(
            title,
            contactPersonFirstName,
            borrowerFirstName,
            getHaffaFullName(haffaUser),
            `${config.appUrl}/item/${id}`,
            haffaUser ? haffaUser['custom:department'] ?? '' : '',
            formatDate(calendarEvent.dateStart),
            formatDate(calendarEvent.dateEnd),
            haffaUser?.email ?? '',
        );

        logDebug(
            `[borrowedEmail] Send email 
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
                    Subject: {
                        Data: `${borrowerFirstName} har hämtat ${title}`,
                    },
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
                `[borrowedEmail] Send e-mail 
                to ${email} 
                failed with ${typedError.message}`,
            );
        }

        return false;
    }

    logDebug(`[borrowedEmail] Email sent to ${email}`);
    return true;
}
