import { AdvertStatus } from 'models/advertStatus';

export default function statusChange(
    newStatus: AdvertStatus | string | undefined,
    previousStatus: AdvertStatus | string | undefined,
): AdvertStatus | undefined {
    return newStatus && previousStatus && newStatus !== previousStatus
        ? (newStatus as AdvertStatus)
        : undefined;
}
