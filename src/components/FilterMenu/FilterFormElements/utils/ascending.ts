import { SortDirection, SortSelection } from '../../../../models/sort';

export default function ascending(selection: SortSelection): boolean {
    return selection.direction === SortDirection.ASCENDING;
}
