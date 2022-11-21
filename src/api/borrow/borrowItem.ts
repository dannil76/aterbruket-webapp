/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { Advert, BorrowStatus, UpdateAdvertInput } from '../../graphql/models';
import {
    getUserBookings,
    mapCalendarToInput,
    removeCalendarEvent,
    updateMissingAccessories,
} from './utils';
import { mapAdvertToUpdateInput } from './mappers';

export default async function borrowItem(
    advert: Advert,
    user: User,
    missing: string[] | undefined,
): Promise<string | undefined> {
    if (!advert.advertBorrowCalendar) {
        return 'Bokningen saknar kalender';
    }

    const { calendarEvents } = advert.advertBorrowCalendar;
    const events = mapCalendarToInput(calendarEvents);

    const userBookings = getUserBookings(events, user);

    if (userBookings.length === 0) {
        return 'Du saknar bokning att hämta';
    }

    // Only able to have 1 booking at a time
    const booking = userBookings[0];

    const calendarEventInput = removeCalendarEvent(events, booking);
    booking.status = BorrowStatus.pickedUp;
    calendarEventInput.push(booking);

    const missingAccessories = updateMissingAccessories(
        advert.missingAccessories,
        missing,
        advert.advertBorrowCalendar,
        user,
    );

    const updateInput = mapAdvertToUpdateInput(advert);

    await API.graphql(
        graphqlOperation(updateAdvert, {
            input: {
                ...updateInput,
                missingAccessories,
                advertBorrowCalendar: {
                    ...advert.advertBorrowCalendar,
                    calendarEvents: calendarEventInput,
                },
            } as UpdateAdvertInput,
        }),
    );

    return undefined;
}
