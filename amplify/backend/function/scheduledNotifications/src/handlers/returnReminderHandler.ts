import {
    senderEmail,
    userPoolId,
    appUrl,
    daysBeforeReturnReminder,
} from '../config';
import { CognitoService, sendEmail, getPickedUpItems } from '../services';
import { Advert, AdvertBorrowCalendarEvent, BorrowStatus } from '../models';
import {
    dateToDayString,
    getHaffaFirstName,
    getHaffaFullName,
    logDebug,
    logException,
    subtractDays,
} from '../utils';
import { returnReminderTemplate } from './templates';

async function sendReminder(
    item: Advert,
    event: AdvertBorrowCalendarEvent,
    reminderDate: string,
): Promise<boolean> {
    if (
        event.status !== BorrowStatus.PICKEDUP ||
        event.dateEnd !== reminderDate
    ) {
        return true;
    }

    logDebug(
        `[returnReminderHandler] found item that is to be returned id:${item.id}"`,
    );
    const borrower = await CognitoService.getUserBySub(
        userPoolId,
        event.borrowedBySub,
    );

    const body = returnReminderTemplate(
        item.id,
        getHaffaFullName(item.contactPerson),
        getHaffaFirstName(borrower.name),
        item.title,
        item.department,
        item.email,
        item.phoneNumber,
        appUrl,
    );

    return sendEmail(
        senderEmail,
        [borrower.email],
        `Dags att lämna igen "${item.title}"`,
        body,
    );
}

function sendReminders(item: Advert): Promise<boolean>[] {
    const reminderDate = subtractDays(new Date(), daysBeforeReturnReminder);
    const remindDay = dateToDayString(reminderDate);

    logDebug(
        `[returnReminderHandler] try to find borrowed items for id:"${item.id}" with end date:"${remindDay}"`,
    );
    return item.advertBorrowCalendar.calendarEvents.map((event) => {
        return sendReminder(item, event, remindDay);
    });
}

export default async function returnReminderHandler(): Promise<boolean> {
    logDebug(`[returnReminderHandler] handler started`);

    try {
        logDebug(
            `[returnReminderHandler] try to get picked up items from open search`,
        );
        const pickedUpAdverts = await getPickedUpItems();
        const emails = [] as Promise<boolean>[];
        pickedUpAdverts.forEach((advert) => {
            emails.push(...sendReminders(advert));
        });

        logDebug(
            `[returnReminderHandler] going through ${emails.length} events`,
        );
        const result = await Promise.all(emails);
        return result.every((mail) => mail);
    } catch (error) {
        const e = error as Error;
        logException(e?.message ?? JSON.stringify(error));
        return false;
    }
}
