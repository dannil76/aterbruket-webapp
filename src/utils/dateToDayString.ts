export default function dateToDayString(date: Date = new Date()): string {
    return date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
}
