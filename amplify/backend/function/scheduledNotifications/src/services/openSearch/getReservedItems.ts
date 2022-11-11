import { AdvertStatus, AdvertType } from 'models';
import { Advert } from 'models/haffaAdvert';
import { logDebug } from '../../utils';
import doSearch from './doSearch';

export default async function getReservedItems(): Promise<Advert[]> {
    const search = {
        query: {
            bool: {
                must: [
                    {
                        match: {
                            status: AdvertStatus.RESERVED,
                        },
                    },
                    {
                        match: {
                            version: 0,
                        },
                    },
                    {
                        match: {
                            advertType: AdvertType.RECYCLE,
                        },
                    },
                ],
            },
        },
    };

    logDebug(`[getReservedItems] get borrowed items`);
    return doSearch(search);
}
