/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { deleteAdvert } from '../graphql/mutations';
import { getItemFromApi } from './items';
import { localization } from '../localizations';

export default async function deleteItem(
    itemId: string,
    setHistory: () => void,
): Promise<string | undefined> {
    const item = await getItemFromApi(itemId);

    if (!item) {
        return localization.getBookingFromServerError;
    }

    await API.graphql({
        query: deleteAdvert,
        variables: { input: { id: itemId, version: 0 } },
    });

    setHistory();

    return undefined;
}
