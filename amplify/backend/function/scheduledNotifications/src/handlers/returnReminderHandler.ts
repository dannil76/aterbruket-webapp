import { senderEmail, userPoolId, appUrl } from '../config';
import { getBorrowedItems, CognitoService, sendEmail } from '../services';
import { BorrowCalendarEvent, Borrowed, BorrowedStatus } from '../models';
import { getHaffaFirstName, getHaffaFullName, logDebug } from '../utils';
import { returnReminderTemplate } from './templates';

function findBorrowers(events: BorrowCalendarEvent[]): string[] {
    return events
        .filter((event) => {
            return event.status === BorrowedStatus.PICKEDUP;
        })
        .map((event) => event.borrowedBySub);
}

async function sendReminder(item: Borrowed): Promise<boolean> {
    const borrowers = findBorrowers(item.advertBorrowCalendar.calendarEvents);
    const users = await Promise.all(
        borrowers.map(async (borrower) => {
            return CognitoService.getUserBySub(userPoolId, borrower);
        }),
    );

    const emails = await Promise.all(
        users.map(async (user) => {
            const body = returnReminderTemplate(
                item.id,
                getHaffaFullName(item.contactPerson),
                getHaffaFirstName(user.name),
                item.title,
                item.department,
                item.email,
                item.phone,
                appUrl,
            );

            return sendEmail(
                senderEmail,
                [user.email],
                `Dags att lämna igen "${item.title}"`,
                body,
            );
        }),
    );

    return emails.every((email) => email);
}

export default async function returnReminderHandler(): Promise<boolean> {
    const today = new Date();
    logDebug(`[returnReminderHandler] handler started`);
    const borrowedItemsToBeReturned = await getBorrowedItems(today);
    logDebug(
        `found ${borrowedItemsToBeReturned.length} items that shall be returned today.`,
    );

    const result = await Promise.all(
        borrowedItemsToBeReturned.map((reservation) => {
            return sendReminder(reservation);
        }),
    );

    return result.every((mail) => mail);
}
