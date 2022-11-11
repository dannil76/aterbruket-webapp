import { logDebug } from '.';

export default async function sendEmailHelper<T>(
    itemList: T[],
    callback: (item: T) => Promise<boolean>[],
): Promise<boolean> {
    logDebug(`[sendEmails] ${itemList.length} items to validate`);
    const emails = [] as Promise<boolean>[];
    itemList.forEach((advert) => {
        emails.push(...callback(advert));
    });

    logDebug(`[sendEmails] ${emails.length} emails to be sent`);
    const result = await Promise.all(emails);
    return result.every((emailSent) => emailSent);
}
