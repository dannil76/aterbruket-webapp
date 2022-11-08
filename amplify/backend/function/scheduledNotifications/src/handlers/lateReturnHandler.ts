import { senderEmail, userPoolId, appUrl } from '../config';
import { getBorrowedItems, CognitoService, sendEmail } from '../services';
import { BorrowCalendarEvent, Borrowed, BorrowedStatus } from '../models';
import {
    getHaffaFirstName,
    getHaffaFullName,
    logDebug,
    subtractDays,
} from '../utils';
import { lateReturnTemplate } from './templates';

function findEvents(events: BorrowCalendarEvent[]): BorrowCalendarEvent[] {
    return events.filter((event) => {
        return event.status === BorrowedStatus.PICKEDUP;
    });
}

async function sendNotification(item: Borrowed): Promise<boolean> {
    const lateReturns = findEvents(item.advertBorrowCalendar.calendarEvents);
    const users = await Promise.all(
        lateReturns.map(async (lateReturn) => {
            return CognitoService.getUserBySub(
                userPoolId,
                lateReturn.borrowedBySub,
            );
        }),
    );

    const emails = await Promise.all(
        lateReturns.map(async (lateReturn) => {
            const borrower = users.find(
                (user) => user.userId === lateReturn.borrowedBySub,
            );

            const borrowerFirstName = getHaffaFirstName(borrower);
            const body = lateReturnTemplate(
                item.id,
                getHaffaFirstName(item.contactPerson),
                borrowerFirstName,
                getHaffaFullName(borrower),
                item.title,
                lateReturn.dateStart,
                lateReturn.dateEnd,
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
        }),
    );

    return emails.every((email) => email);
}

export default async function lateReturnHandler(): Promise<boolean> {
    const yesterday = subtractDays(new Date(), 1);
    logDebug(`[lateReturnHandler] handler started`);
    const borrowedItemsThatIsLate = await getBorrowedItems(yesterday);
    logDebug(`found ${borrowedItemsThatIsLate} items that is late.`);

    const result = await Promise.all(
        borrowedItemsThatIsLate.map((reservation) => {
            return sendNotification(reservation);
        }),
    );

    return result.every((mail) => mail);
}
