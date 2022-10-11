import { AdvertType, Event, EventType, EventRecord } from './models/awsEvent';
import * as borrow from './utils/borrowHelper';
import * as recycle from './utils/recycleHelper';
import { getEnum } from './utils/eventHelper';
import { logDebug, logWarning } from './utils/logHelper';

exports.handler = async function NotifyByEmail(event: Event): Promise<string> {
    logDebug("emailnotification started")
    const operations = event.Records.map((record: EventRecord) => {
        logDebug(`read event ${record.eventName}`)
        const streamRecord = record.dynamodb;
        const previousItem = streamRecord.OldImage;
        const newItem = streamRecord.NewImage;
        const advertType =
            getEnum<AdvertType>(newItem?.advertType) ??
            getEnum<AdvertType>(previousItem?.advertType);

        logDebug(`event type: ${advertType}`)
        if (advertType === AdvertType.BORROW) {
            switch (record.eventName) {
                case EventType.INSERT:
                    return borrow.onInsert(newItem);
                case EventType.MODIFY:
                    return borrow.onModify(previousItem, newItem);
                case EventType.DELETE:
                    return borrow.onDelete(previousItem);
                case EventType.REMOVE:
                    return borrow.onDelete(previousItem);
                default:
                    return Promise.resolve(true);
            }
        }

        if (advertType === AdvertType.RECYCLE) {
            switch (record.eventName) {
                case EventType.INSERT:
                    return recycle.onInsert(newItem);
                case EventType.MODIFY:
                    return recycle.onModify(previousItem, newItem);
                case EventType.DELETE:
                    return recycle.onDelete(previousItem);
                case EventType.REMOVE:
                    return recycle.onDelete(previousItem);
                default:
                    return Promise.resolve(true);
            }
        }

        logWarning(`Type ${advertType} is unknown. Return true.`)
        return Promise.resolve(true);
    });

    logDebug(`Number of events ${operations.length}`)
    const statuses = await Promise.all(operations);

    if (statuses.some((status) => { !status })) {
        throw new Error("One or more events failed")
    }

    return `Handled ${operations.length} successfully`
};
