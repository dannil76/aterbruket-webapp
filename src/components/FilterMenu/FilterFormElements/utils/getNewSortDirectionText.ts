import { SortDirection, SortValue } from '../../../../models/sort';

export default function getNewSortDirectionText(
    direction: SortDirection,
    value: SortValue,
): string {
    return direction === SortDirection.ASCENDING
        ? value.descendingText
        : value.ascendingText;
}
