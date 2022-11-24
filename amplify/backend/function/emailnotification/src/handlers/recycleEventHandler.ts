import { getChangedPickUp, logDebug, logWarning } from '../utils';
import {
    confirmNewReservationEmail,
    notifyAboutNewReservationEmail,
    newAdvertEmail,
    pickedUpEmail,
} from '../emails';
import { AdvertStatus } from '../models/enums';
import { Advert } from '../models/haffaAdvert';

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

    const changedReservation = getChangedPickUp(
        previousItem.advertPickUps,
        newItem.advertPickUps,
    );

    if (!changedReservation) {
        logWarning(
            '[recycleEventHandler] reservation is undefined. Return true and skip email',
        );
        return true;
    }

    logDebug(
        `found reservation: 
            by ${changedReservation.reservedBySub} 
            on ${changedReservation.reservationDate} 
            for ${changedReservation.quantity} 
            picked up ${changedReservation.pickedUp}`,
    );

    if (!changedReservation.pickedUp) {
        emails.push(confirmNewReservationEmail(newItem, changedReservation));
        emails.push(
            notifyAboutNewReservationEmail(newItem, changedReservation),
        );
    }

    if (changedReservation.pickedUp) {
        emails.push(pickedUpEmail(newItem, changedReservation));
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
