/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from 'aws-amplify';
import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { Advert, ItemStatus, SearchAdvertsQuery } from '../../graphql/models';
import { HaffaFilter } from '../../models/filter';
import { SortSelection } from '../../models/sort';
import { searchAdverts } from '../../graphql/queries';
import { PaginationOptions } from '../../models/pagination';
import { allCategories, allCategoryTitles } from '../../static/categories';

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

    const newList = [...currentItems];
    let first = newList.length === 0;
    const query = {
        filter,
        sort,
        limit: itemsToShow,
    } as any;

    if (searchValue) {
        query.filter.or = [
            {
                title: {
                    matchPhrasePrefix: `${searchValue}`,
                },
            },
            {
                description: {
                    matchPhrasePrefix: `${searchValue}`,
                },
            },
            {
                aterbruketId: {
                    match: `${searchValue}`,
                },
            },
        ];

        if (allCategoryTitles[searchValue.toLowerCase()]) {
            const categoryKey = allCategories.find(
                (cat) => cat.title.toLowerCase() === searchValue.toLowerCase(),
            )?.key;

            query.filter.or.push({
                category: {
                    match: categoryKey,
                },
            });
        }
    }

    while ((newList.length <= pageStartIndex && fetchToken) || first) {
        if (fetchToken) {
            query.nextToken = fetchToken;
        }

        // eslint-disable-next-line no-await-in-loop
        result = (await API.graphql(
            graphqlOperation(searchAdverts, query),
        )) as GraphQLResult<SearchAdvertsQuery>;

        first = false;
        const searchResult = result?.data?.searchAdverts
            ?.items as (Advert | null)[];

        const foundItems = searchResult.filter((item) => item) as Advert[];

        newList.push(...foundItems);
        fetchToken = result?.data?.searchAdverts?.nextToken ?? undefined;
    }

    // Amplify total shows items before filtering on search value.
    // Use newlist length if it's less than page size and uses opensearch matching
    const advertTotal =
        searchValue && newList.length <= itemsToShow
            ? newList.length
            : result?.data?.searchAdverts?.total ?? 0;
    const pagination = {
        amountToShow: itemsToShow,
        itemLength: advertTotal,
        totalPages: Math.ceil(advertTotal / itemsToShow),
    };

    setPagination(pagination);

    setToken(fetchToken);
    const filteredItems = newList.filter((item) => item !== null) as Advert[];
    return filteredItems;
}
