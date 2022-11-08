export default function subtractDays(date: Date, days: number): Date {
    date.setDate(date.getDate() - days);
    return date;
}
