import {
    SortDirection,
    SortSelection,
    SortValue,
} from '../../../../models/sort';
import getNewSortDirectionText from './getNewSortDirectionText';
import switchSortDirection from './switchSortDirection';

export default function map(
    direction: SortDirection,
    sortValue: SortValue,
): SortSelection {
    return {
        first: sortValue.low,
        second: sortValue.second,
        sortTitle: sortValue.title,
        secText: getNewSortDirectionText(direction, sortValue),
        direction: switchSortDirection(direction),
        id: sortValue.id,
        field: sortValue.field,
        text: getNewSortDirectionText(direction, sortValue),
        title: sortValue.title,
    };
}
