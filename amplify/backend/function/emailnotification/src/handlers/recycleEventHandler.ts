import { AdvertStatus } from '../models/enums';
import { Advert } from '../models/haffaAdvert';
import { logDebug, logWarning } from '../utils/logHelper';
import { newReservationEmail, newAdvertEmail, pickedUpEmail } from '../emails';

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
            `[recycleEventHandler] New or previous item is undefined. Return false.`,
        );
        return false;
    }

    const emails = [] as Promise<boolean>[];

    logDebug(
        `new status: ${newItem.status}, old status: ${previousItem.status}`,
    );

    if (
        previousItem.status === AdvertStatus.AVAILABLE &&
        newItem.status === AdvertStatus.RESERVED
    ) {
        emails.push(newReservationEmail(newItem));
    }

    if (
        previousItem.status === AdvertStatus.RESERVED &&
        newItem.status === AdvertStatus.PICKEDUP
    ) {
        emails.push(pickedUpEmail(newItem));
    }

    if (
        previousItem.status === AdvertStatus.PICKEDUP &&
        newItem.status === AdvertStatus.AVAILABLE
    ) {
        emails.push(newAdvertEmail(newItem));
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
        logWarning(`[recycleEventHandler] Item is undefined. Return false.`);
        return false;
    }

    const emails = [] as Promise<boolean>[];
    logDebug(`[recycleEventHandler] Do nothing on delete.`);
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
        logWarning(`[recycleEventHandler] Item is undefined. Return false.`);
        return false;
    }

    const emails = [] as Promise<boolean>[];

    if (newItem.version > 0) {
        logDebug(
            '[recycleEventHandler] received history-log item. Ignore history posts',
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
