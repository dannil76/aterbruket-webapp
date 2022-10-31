import { logDebug } from './logHelper';

export default function formatDate(date: Date): string {
    if (!date) {
        logDebug('[formatDate] date is null. Return empty string.');
        return '';
    }

    const dateOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Stockholm',
    } as Intl.DateTimeFormatOptions;

    const dateString = date.toLocaleTimeString('sv-SE', dateOptions);
    logDebug(`date format: ${dateString}`);
    return dateString;
}
