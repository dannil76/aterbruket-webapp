import {
    ItemAdvertType,
    SearchableAdvertSortableFields,
} from '../graphql/models';

export type HaffaTypeFilter = {
    [key in ItemAdvertType]: boolean;
};

export const DefaultHaffaTypeFilter = {} as HaffaTypeFilter;

export interface HaffaFilter {
    advertTypes: HaffaTypeFilter;
    conditions: SearchableAdvertSortableFields.conditionValue[];
    categories: string[];
}
