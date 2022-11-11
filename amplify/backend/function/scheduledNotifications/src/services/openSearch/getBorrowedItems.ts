import { Advert } from 'models/haffaAdvert';
import { logDebug } from '../../utils';
import doSearch from './doSearch';

export default async function getBorrowedItems(): Promise<Advert[]> {
    const search = {
        query: {
            match: {
                'advertBorrowCalendar.calendarEvents.status': {
                    query: 'pickedUp',
                },
            },
        },
    };

    logDebug(`[getBorrowedItems] get borrowed items`);
    return doSearch(search);
}
