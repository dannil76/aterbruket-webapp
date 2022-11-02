import { getAdvertCalendarChange, logDebug, logWarning } from '../utils';
import { AdvertStatus, BorrowStatus } from '../models/enums';
import { Advert } from '../models/haffaAdvert';
import {
    missingAccessoryEmail,
    pickedUpEmail,
    returnedEmail,
    newAdvertEmail,
    newReservationEmail,
} from '../emails';

/**
 * Handle modifications in the Haffa database.This is usually the modification of the current version 0 item.
 * History posts are always treated as inserts. This handler checks what has actually been updated and
 * tries to act accordingly
 * @param previousItem previous version of the item
 * @param newItem new updated version
 * @returns true if all handlers was successful
 */
export async function onModify(
    previousItem: Advert | undefined,
    newItem: Advert | undefined,
): Promise<boolean> {
    if (!previousItem || !newItem) {
        logWarning(
            `[borrowEventHandler]  New or previous item is undefined. Return false.`,
        );
        return false;
    }

    const emails = [] as Promise<boolean>[];
    const previousMissing = previousItem.missingAccessories;
    const newlyMissing = newItem.missingAccessories;

    if (newlyMissing.length > previousMissing.length) {
        logDebug(
            `[borrowEventHandler] Missing accessories has been changed. Was ${previousMissing.length} but now ${newlyMissing.length}`,
        );
        emails.push(missingAccessoryEmail(newItem));
    }

    const calendarChange = getAdvertCalendarChange(
        previousItem.advertBorrowCalendar.calendarEvents,
        newItem.advertBorrowCalendar.calendarEvents,
    );

    if (calendarChange && calendarChange.status === BorrowStatus.RESERVED) {
        emails.push(newReservationEmail(newItem, calendarChange));
    }

    if (calendarChange && calendarChange.status === BorrowStatus.PICKEDUP) {
        emails.push(pickedUpEmail(newItem, calendarChange));
    }

    if (calendarChange && calendarChange.status === BorrowStatus.RETURNED) {
        emails.push(returnedEmail(newItem, calendarChange));
    }

    const responses = await Promise.all(emails);
    return responses.length === 0 || responses.every((response) => response);
}

/**
 * Handle deletes in the Haffa database.
 * @param previousItem Item that is created
 * @returns true if all handlers was successful
 */
export async function onDelete(
    previousItem: Advert | undefined,
): Promise<boolean> {
    if (!previousItem) {
        logWarning(`[borrowEventHandler] Item is undefined. Return false.`);
        return false;
    }

    const emails = [] as Promise<boolean>[];
    logDebug(`[borrowEventHandler] Do nothing on delete.`);
    const responses = await Promise.all(emails);
    return responses.length === 0 || responses.every((response) => response);
}

/**
 * Handle inserts in Haffa database. Version 0 is the current item. History posts get versions > 0 with previous states
 * @param newItem Item that is created
 * @returns true if all handlers was successful
 */
export async function onInsert(newItem: Advert | undefined): Promise<boolean> {
    if (!newItem) {
        logWarning(`[borrowEventHandler] Item is undefined. Return false.`);
        return false;
    }

    const emails = [] as Promise<boolean>[];

    if (newItem.version > 0) {
        logDebug(
            '[borrowEventHandler] Received history-log item. Ignore history posts',
        );
        return true;
    }

    // Ignore drafts
    if (newItem.status === AdvertStatus.AVAILABLE) {
        emails.push(newAdvertEmail(newItem));
    }

    const responses = await Promise.all(emails);
    return responses.length === 0 || responses.every((response) => response);
}
