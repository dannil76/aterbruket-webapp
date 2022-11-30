/* eslint-disable @typescript-eslint/no-explicit-any */
import { API } from 'aws-amplify';
import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import {
    Advert,
    SearchableAdvertFilterInput,
    SearchAdvertsQuery,
} from '../../graphql/models';
import { searchAdverts } from '../../graphql/queries';

export default async function getItemsToPickup(
    userSub: string,
): Promise<Advert[]> {
    let fetchToken;
    let first = true;
    let result = undefined as GraphQLResult<SearchAdvertsQuery> | undefined;

    const filter = {
        version: { eq: 0 },
        toPickUpBySubs: { eq: userSub },
    } as SearchableAdvertFilterInput;

    const newList = [];

    const query = {
        filter,
        limit: 50,
    } as any;

    while (fetchToken || first) {
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

    const filteredItems = newList.filter((item) => item !== null) as Advert[];
    return filteredItems;
}
