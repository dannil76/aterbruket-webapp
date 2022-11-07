export default function dateToDayString(date: Date): string {
    return date.toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
}
