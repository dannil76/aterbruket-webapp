import { AdvertStatus } from '../models/advertStatus';
import { Advert } from '../models/haffaAdvert';
import { logDebug, logWarning } from '../utils/logHelper';
import newReservationEmail from '../emails/newReservationEmail';
import newAdvertEmail from '../emails/newAdvertEmail';
import pickedUpEmail from '../emails/pickedUpEmail';
import statusChange from '../utils/statusChange';

export async function onModify(
    previousItem: Advert | undefined,
    newItem: Advert | undefined,
): Promise<boolean> {
    if (!previousItem || !newItem) {
        logWarning(
            `[recycleHelper] New or previous item is undefined. Return false.`,
        );
        return false;
    }

    const emails = [] as Promise<boolean>[];

    logDebug(
        `new status: ${newItem.status}, old status: ${previousItem.status}`,
    );

    if (
        statusChange(newItem.status, previousItem.status) ===
        AdvertStatus.RESERVED
    ) {
        emails.push(newReservationEmail(newItem));
    }

    if (
        statusChange(newItem.status, previousItem.status) ===
        AdvertStatus.PICKEDUP
    ) {
        emails.push(pickedUpEmail(newItem));
    }

    await Promise.all(emails);
    return true;
}

export async function onDelete(
    previousItem: Advert | undefined,
): Promise<boolean> {
    if (!previousItem) {
        logWarning(`[recycleHelper] Item is undefined. Return false.`);
        return false;
    }

    logDebug(`[recycleHelper] Do nothing on delete.`);
    return true;
}

export async function onInsert(newItem: Advert | undefined): Promise<boolean> {
    if (!newItem) {
        logWarning(`[recycleHelper] Item is undefined. Return false.`);
        return false;
    }

    const emails = [] as Promise<boolean>[];

    logDebug(`new status: ${newItem.status}`);

    if (newItem.status === AdvertStatus.AVAILABLE) {
        emails.push(newAdvertEmail(newItem));
    }

    await Promise.all(emails);
    return true;
}
