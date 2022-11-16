export default function isDateBetween(
    date: Date | string | number | null | undefined,
    startDate: Date | string | number | null | undefined,
    endDate: Date | string | number | null | undefined,
): boolean {
    if (!date) {
        return false;
    }

    const inputDate = new Date(date);
    const inputStartDate = startDate ? new Date(startDate) : new Date();
    const inputEndDate = endDate ? new Date(endDate) : new Date();

    return inputDate >= inputStartDate && inputDate <= inputEndDate;
}
