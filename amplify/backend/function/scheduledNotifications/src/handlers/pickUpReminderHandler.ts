import { sendEmail, CognitoService, getReservedItems } from '../services';
import {
    dateToDayString,
    getHaffaFirstName,
    getHaffaFullName,
    logDebug,
    logException,
    sendEmailHelper,
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

async function sendReminder(advert: Advert): Promise<boolean> {
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

function sendReminders(item: Advert): Promise<boolean>[] {
    logDebug(
        `[pickUpReminderHandler] try to find reserved items for id:"${item.id}"`,
    );

    const reservationDate = subtractDays(new Date(), daysUntilPickUpReminder);
    const reservationDay = dateToDayString(reservationDate);
    if (item.reservationDate !== reservationDay) {
        return [Promise.resolve(true)];
    }

    return [sendReminder(item)];
}

export default async function pickUpReminderHandler(): Promise<boolean> {
    logDebug(`[pickUpReminderHandler] handler started`);

    const reservations = await getReservedItems();
    logDebug(`found ${reservations.length} reservations that need reminders.`);
    return sendEmailHelper(reservations, sendReminders);
}
