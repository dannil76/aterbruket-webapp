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
import { returnedTemplate } from './templates';
import Config from '../../config';

const emailService = new SES();
const config = new Config();

export default async function sendReturnedEmail(
    newItem: Advert,
    calendarEvent: AdvertBorrowCalendarEvent,
): Promise<boolean> {
    logDebug(`[sendReturnedEmail] Start sendReturnedEmail.`);
    const { title, contactPerson, id, email } = newItem;

    try {
        const haffaUser = await getReservedByUser(calendarEvent.borrowedBySub);
        const firstName = getHaffaFirstName(haffaUser);
        const body = returnedTemplate(
            title,
            getHaffaFirstName(contactPerson),
            firstName,
            getHaffaFullName(haffaUser),
            `${config.appUrl}/item/${id}`,
            haffaUser ? haffaUser['custom:department'] ?? '' : '',
            formatDate(calendarEvent.dateStart),
            formatDate(calendarEvent.dateEnd),
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
                    Subject: {
                        Data: `${firstName} har lämnat tillbaka ${title}`,
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
