import { Advert } from 'models/haffaAdvert';
import { logDebug, logWarning } from './logHelper';
import newReservationEmail from '../emails/newReservationEmail';
import newAdvertEmail from '../emails/newAdvertEmail';

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

    if (
        newItem.reservedBySub &&
        newItem.reservedBySub !== previousItem.reservedBySub
    ) {
        newReservationEmail(newItem);
    }

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

    return newAdvertEmail(newItem);
}
