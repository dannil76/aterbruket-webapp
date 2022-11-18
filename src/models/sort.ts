import { SearchableAdvertSortableFields } from '../graphql/models';

export enum SortDirection {
    DESCENDING = 'desc',
    ASCENDING = 'asc',
}

export interface SortValue {
    title: string;
    id: string;
    low: string;
    lowText: string;
    high: string;
    highText: string;
    second: string;
    field: string;
    ascendingText: string;
    descendingText: string;
}

export interface SortSelection {
    id: string;
    title: string;
    sortTitle: string;
    first: string;
    second: string;
    secText: string;
    direction: SortDirection;
    field: string;
    text: string;
}
export const climateImpactSort = {
    title: 'Klimatavtryck',
    id: 'climateImpactLow',
    low: 'climateImpact',
    lowText: 'Lägst',
    high: '-climateImpact',
    highText: 'Högst',
    second: '-createdAt',
    field: SearchableAdvertSortableFields.climateImpact,
    ascendingText: 'Lägst',
    descendingText: 'Högst',
} as SortValue;

export const nameSort = {
    title: 'Namn',
    id: 'titleAÖ',
    low: 'title^',
    lowText: 'A - Ö',
    high: '-title^',
    highText: 'Ö - A',
    second: '-createdAt',
    field: SearchableAdvertSortableFields.title,
    ascendingText: 'A - Ö',
    descendingText: 'Ö - A',
} as SortValue;

export const createdSort = {
    title: 'Skapad',
    id: 'age',
    low: '-createdAt',
    lowText: 'Senast',
    high: 'createdAt',
    highText: 'Äldst',
    second: '',
    field: SearchableAdvertSortableFields.createdAt,
    ascendingText: 'Äldst',
    descendingText: 'Senast',
} as SortValue;

export const conditionSort = {
    title: 'Skick',
    id: 'condition',
    low: 'condition',
    lowText: 'Bäst',
    high: '-condition',
    highText: 'Sämst',
    second: '-createdAt',
    field: SearchableAdvertSortableFields.conditionValue,
    ascendingText: 'Bäst',
    descendingText: 'Sämst',
} as SortValue;

export const sortValues = [
    climateImpactSort,
    nameSort,
    createdSort,
    conditionSort,
];

export const DEFAULTSORTVALUE = {
    direction: SortDirection.DESCENDING,
    sortTitle: createdSort.title,
    title: createdSort.title,
    id: createdSort.id,
    field: createdSort.field,
    second: createdSort.second,
    secText: createdSort.descendingText,
    text: createdSort.descendingText,
    first: createdSort.low,
} as SortSelection;
