import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import { API } from 'aws-amplify';
import { Advert, GetAdvertQuery } from '../../graphql/models';
import { getAdvert } from '../../graphql/queries';

export default async function getItemFromApi(
    id: string,
): Promise<Advert | undefined> {
    try {
        const result = (await API.graphql(
            graphqlOperation(getAdvert, { id, version: 0 }),
        )) as GraphQLResult<GetAdvertQuery>;
        const advertItem = result.data?.getAdvert as Advert | undefined;

        return advertItem ?? undefined;
    } catch (error) {
        console.log(JSON.stringify(error));
        return undefined;
    }
}
