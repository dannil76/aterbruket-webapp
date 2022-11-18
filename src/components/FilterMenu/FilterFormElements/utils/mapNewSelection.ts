import {
    SortDirection,
    SortSelection,
    SortValue,
} from '../../../../models/sort';
import getNewSortDirectionText from './getNewSortDirectionText';
import switchSortDirection from './switchSortDirection';

export default function map(
    previousSorting: SortSelection,
    direction: SortDirection,
    value: SortValue,
): SortSelection {
    return {
        ...previousSorting,
        direction: switchSortDirection(direction),
        text: getNewSortDirectionText(direction, value),
    };
}
