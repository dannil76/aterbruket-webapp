import { Advert } from 'models/haffaAdvert';
import { logDebug, logWarning } from './logHelper';
import { sendMissingAccessoryNotification } from '../emails/missingAccessoryEmail';
import newAdvertEmail from '../emails/newAdvertEmail';

export async function onModify(
    previousItem: Advert | undefined,
    newItem: Advert | undefined,
): Promise<boolean> {
    if (!previousItem || !newItem) {
        logWarning(
            `[borrowHelper]  New or previous item is undefined. Return false.`,
        );
        return false;
    }

    const previousMissing = previousItem.missingAccessories;
    const newlyMissing = newItem.missingAccessories;

    if (newlyMissing.length > previousMissing.length) {
        logDebug(
            `[borrowHelper] Missing accessories has been changed. Was ${previousMissing.length} but now ${newlyMissing.length}`,
        );
        return sendMissingAccessoryNotification(newItem);
    }

    logDebug(
        `[borrowHelper] Number of missing accessories has not been changed. Was ${previousMissing.length} but now ${newlyMissing.length}`,
    );
    return true;
}

export async function onDelete(
    previousItem: Advert | undefined,
): Promise<boolean> {
    if (!previousItem) {
        logWarning(`[borrowHelper] Item is undefined. Return false.`);
        return false;
    }

    logDebug(`[borrowHelper] Do nothing on delete.`);
    return true;
}

export async function onInsert(newItem: Advert | undefined): Promise<boolean> {
    if (!newItem) {
        logWarning(`[borrowHelper] Item is undefined. Return false.`);
        return false;
    }

    return newAdvertEmail(newItem);
}
