import { SortDirection } from '../../../../models/sort';

export default function getNewDirection(
    direction: SortDirection,
): SortDirection {
    return direction === SortDirection.ASCENDING
        ? SortDirection.DESCENDING
        : SortDirection.ASCENDING;
}
