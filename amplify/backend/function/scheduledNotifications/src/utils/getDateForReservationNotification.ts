function getDaysFromEnv() {
    const days = process.env.RESERVATION_DAYS_UNTIL_NOTIFICATIONS;
    const numberOfDays = Number.parseInt(days, 10);

    return Number.isNaN(numberOfDays) ? 0 : numberOfDays;
}

export default function getReservationDay(): Date {
    const date = new Date();
    date.setDate(date.getDate() - getDaysFromEnv());
    return date;
}
