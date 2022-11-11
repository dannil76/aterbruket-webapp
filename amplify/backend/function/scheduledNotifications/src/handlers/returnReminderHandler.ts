import {
    senderEmail,
    userPoolId,
    appUrl,
    daysBeforeReturnReminder,
} from '../config';
import { CognitoService, sendEmail, getBorrowedItems } from '../services';
import { Advert, AdvertBorrowCalendarEvent, BorrowStatus } from '../models';
import {
    dateToDayString,
    getHaffaFirstName,
    getHaffaFullName,
    logDebug,
    sendEmailHelper,
    subtractDays,
} from '../utils';
import { returnReminderTemplate } from './templates';

async function sendReminder(
    item: Advert,
    event: AdvertBorrowCalendarEvent,
): Promise<boolean> {
    logDebug(
        `[returnReminderHandler] get borrower ${event.borrowedBySub} for ${item.id}"`,
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
    return item.advertBorrowCalendar.calendarEvents
        .filter(
            (event) =>
                event.status === BorrowStatus.PICKEDUP &&
                event.dateEnd === remindDay,
        )
        .map((event) => {
            return sendReminder(item, event);
        });
}

export default async function returnReminderHandler(): Promise<boolean> {
    logDebug(`[returnReminderHandler] handler started`);
    const pickedUpAdverts = await getBorrowedItems();
    return sendEmailHelper(pickedUpAdverts, sendReminders);
}
