/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { Advert, BorrowStatus } from '../../graphql/models';
import {
    getUserBookings,
    mapCalendarToInput,
    removeCalendarEvent,
} from './utils';

export default async function returnItem(
    advert: Advert,
    user: User,
): Promise<string | undefined> {
    if (!advert.advertBorrowCalendar) {
        return 'Bokningen saknar kalender';
    }

    const { calendarEvents } = advert.advertBorrowCalendar;
    const events = mapCalendarToInput(calendarEvents);
    const userBookings = getUserBookings(events, user);

    if (userBookings.length === 0) {
        return 'Du saknar bokning att lämna';
    }

    // Only able to have 1 booking at a time
    const booking = userBookings[0];

    const advertBorrowCalendar = removeCalendarEvent(events, booking);
    booking.status = BorrowStatus.returned;
    advertBorrowCalendar.push(booking);

    await API.graphql(
        graphqlOperation(updateAdvert, {
            input: {
                ...advert,
                advertBorrowCalendar,
            },
        }),
    );

    return undefined;
}
