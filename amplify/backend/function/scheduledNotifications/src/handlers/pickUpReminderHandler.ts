import { getReservations, sendEmail, CognitoService } from '../services';
import {
    getHaffaFirstName,
    getHaffaFullName,
    logDebug,
    logException,
    subtractDays,
} from '../utils';
import { Advert } from '../models';
import {
    userPoolId,
    appUrl,
    daysUntilPickUpReminder,
    daysUntilAutoCancellation,
    senderEmail,
} from '../config';
import { pickUpReminderTemplate } from './templates';

async function sendReminder(advert: Advert) {
    try {
        const user = await CognitoService.getUserBySub(
            userPoolId,
            advert.reservedBySub,
        );

        const { id, title, department, email, phoneNumber } = advert;

        const body = pickUpReminderTemplate(
            id,
            getHaffaFullName(advert.contactPerson),
            getHaffaFirstName(user.name),
            daysUntilPickUpReminder,
            daysUntilAutoCancellation,
            title,
            department,
            email,
            phoneNumber,
            appUrl,
        );

        return sendEmail(
            senderEmail,
            [user.email],
            `Dags att hämta "${title}"`,
            body,
        );
    } catch (error) {
        logException((error as Error)?.message ?? error);

        return false;
    }
}

export default async function pickUpReminderHandler(): Promise<boolean> {
    logDebug(`[pickUpReminderHandler] handler started`);
    const reservationDate = subtractDays(new Date(), daysUntilPickUpReminder);
    const reservations = await getReservations(reservationDate);
    logDebug(`found ${reservations.length} reservations that need reminders.`);

    const result = await Promise.all(
        reservations.map((reservation) => {
            return sendReminder(reservation);
        }),
    );

    return result.every((mail) => mail);
}
