import { SortDirection, SortSelection } from '../../../../models/sort';

export default function descending(selection: SortSelection): boolean {
    return selection.direction === SortDirection.DESCENDING;
}
