import { API } from 'aws-amplify';
import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { Advert, ItemStatus, SearchAdvertsQuery } from '../../graphql/models';
import { HaffaFilter } from '../../models/filter';
import { SortSelection } from '../../models/sort';
import { searchAdverts } from '../../graphql/queries';
import { PaginationOptions } from '../../models/pagination';

export default async function getItemsFromApi(
    activePage: number,
    itemsToShow: number,
    sortSelection: SortSelection,
    queryToken: string | undefined,
    currentItems: Advert[],
    currentFilter: HaffaFilter,
    searchValue: string,
    setToken: React.Dispatch<React.SetStateAction<string | undefined>>,
    setPagination: React.Dispatch<React.SetStateAction<PaginationOptions>>,
): Promise<Advert[]> {
    const pageStartIndex = (activePage - 1) * itemsToShow;
    const pageLastIndex = activePage * itemsToShow;

    if (currentItems.length >= pageLastIndex) {
        return currentItems;
    }

    const sort = {
        direction: sortSelection.direction,
        field: sortSelection.field,
    };

    let fetchToken = queryToken;
    let result = undefined as GraphQLResult<SearchAdvertsQuery> | undefined;

    const filter = {
        version: { eq: 0 },
        status: { eq: ItemStatus.available },
    } as any;

    if (
        currentFilter.advertTypes?.borrow &&
        !currentFilter.advertTypes?.recycle
    ) {
        filter.advertType = { eq: 'borrow' };
    } else if (
        currentFilter.advertTypes?.recycle &&
        !currentFilter.advertTypes?.borrow
    ) {
        filter.advertType = { eq: 'recycle' };
    }

    if (searchValue) {
        filter.title = { wildcard: `*${searchValue}*` };
    }

    const newList = [...currentItems];
    let first = newList.length === 0;
    while ((currentItems.length <= pageStartIndex && fetchToken) || first) {
        if (fetchToken) {
            // eslint-disable-next-line no-await-in-loop
            result = (await API.graphql(
                graphqlOperation(searchAdverts, {
                    filter,
                    sort,
                    limit: itemsToShow,
                    nextToken: fetchToken,
                }),
            )) as GraphQLResult<SearchAdvertsQuery>;
        } else {
            // eslint-disable-next-line no-await-in-loop
            result = (await API.graphql(
                graphqlOperation(searchAdverts, {
                    filter,
                    sort,
                    limit: itemsToShow,
                }),
            )) as GraphQLResult<SearchAdvertsQuery>;
        }

        first = false;
        const searchResult = result?.data?.searchAdverts
            ?.items as (Advert | null)[];

        const foundItems = searchResult.filter((item) => item) as Advert[];

        newList.push(...foundItems);
        fetchToken = result?.data?.searchAdverts?.nextToken ?? undefined;
    }

    const advertTotal = result?.data?.searchAdverts?.total ?? 0;
    setPagination({
        amountToShow: itemsToShow,
        itemLength: advertTotal,
        totalPages: Math.ceil(advertTotal / itemsToShow),
    });

    setToken(fetchToken);
    return newList.filter((item) => item !== null) as Advert[];
}
