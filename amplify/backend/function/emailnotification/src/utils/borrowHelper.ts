import { MissingAccessory, ModelRecord, BorrowInfo } from '../models/awsEvent';
import { getList } from './eventHelper';
import { logDebug, logWarning } from './logHelper';
import { sendMissingAccessoryNotification } from './sendMissingAccessoryNotification';
import sendNewAdvertNotification from './sendNewAdvertNotification';

export async function onModify(
    previousItem: BorrowInfo | undefined,
    newItem: BorrowInfo | undefined,
): Promise<boolean> {
    if (!previousItem || !newItem) {
        logWarning(
            `[borrowHelper]  New or previous item is undefined. Return false.`,
        );
        return false;
    }

    const previousMissing = getList<ModelRecord<MissingAccessory>>(
        previousItem.missingAccessories,
    );
    const newlyMissing = getList<ModelRecord<MissingAccessory>>(
        newItem.missingAccessories,
    );

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
    previousItem: BorrowInfo | undefined,
): Promise<boolean> {
    if (!previousItem) {
        logWarning(`[borrowHelper] Item is undefined. Return false.`);
        return false;
    }

    logDebug(`[borrowHelper] Do nothing on delete.`);
    return true;
}

export async function onInsert(
    newItem: BorrowInfo | undefined,
): Promise<boolean> {
    if (!newItem) {
        logWarning(`[borrowHelper] Item is undefined. Return false.`);
        return false;
    }

    return sendNewAdvertNotification(newItem);
}
