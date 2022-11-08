export default function parseNumber(
    value: string | undefined,
    defaultValue = 0,
): number {
    if (!value) {
        return defaultValue;
    }

    const result = Number.parseInt(value, 10);
    return Number.isNaN(result) ? defaultValue : result;
}
