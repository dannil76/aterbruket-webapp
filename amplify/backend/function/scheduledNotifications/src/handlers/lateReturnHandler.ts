import { senderEmail, userPoolId, appUrl } from '../config';
import { getBorrowedItems, CognitoService, sendEmail } from '../services';
import { Advert, AdvertBorrowCalendarEvent, BorrowStatus } from '../models';
import {
    dateToDayString,
    getHaffaFirstName,
    getHaffaFullName,
    logDebug,
    sendEmailHelper,
    subtractDays,
} from '../utils';
import { lateReturnTemplate } from './templates';

async function sendNotification(
    item: Advert,
    event: AdvertBorrowCalendarEvent,
): Promise<boolean> {
    logDebug(
        `[returnReminderHandler] Item is late. Find borrower ${event.borrowedBySub} for ${item.id}"`,
    );
    const borrower = await CognitoService.getUserBySub(
        userPoolId,
        event.borrowedBySub,
    );

    const borrowerFirstName = getHaffaFirstName(borrower);
    const body = lateReturnTemplate(
        item.id,
        getHaffaFirstName(item.contactPerson),
        borrowerFirstName,
        getHaffaFullName(borrower),
        item.title,
        event.dateStart,
        event.dateEnd,
        item.department,
        item.email,
        appUrl,
    );

    return sendEmail(
        senderEmail,
        [item.email],
        `${borrowerFirstName} har inte lämnat tillbaka "${item.title}"`,
        body,
    );
}

function sendReminders(item: Advert): Promise<boolean>[] {
    const yesterDate = subtractDays(new Date(), 1);
    const yesterday = dateToDayString(yesterDate);
    return item.advertBorrowCalendar.calendarEvents
        .filter(
            (event) =>
                event.status === BorrowStatus.PICKEDUP &&
                event.dateEnd === yesterday,
        )
        .map((event) => {
            return sendNotification(item, event);
        });
}

export default async function lateReturnHandler(): Promise<boolean> {
    logDebug(`[lateReturnHandler] handler started`);
    const adverts = await getBorrowedItems();
    return sendEmailHelper(adverts, sendReminders);
}
