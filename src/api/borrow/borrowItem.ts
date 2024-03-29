/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { BorrowStatus, UpdateAdvertInput } from '../../graphql/models';
import {
    getUserBookings,
    mapCalendarToInput,
    removeCalendarEvent,
    updateMissingAccessories,
} from './utils';
import { mapAdvertToUpdateInput } from './mappers';
import { getItemFromApi } from '../items';
import { localization } from '../../localizations';

export default async function borrowItem(
    itemId: string,
    user: User,
    missing: string[] | undefined,
): Promise<string | undefined> {
    const item = await getItemFromApi(itemId);

    if (!item) {
        return localization.getBookingFromServerError;
    }

    if (!item.advertBorrowCalendar) {
        return localization.itemMissingCalendar;
    }
    const { calendarEvents } = item.advertBorrowCalendar;
    const events = mapCalendarToInput(calendarEvents);
    const userBookings = getUserBookings(events, user);

    if (userBookings.length === 0) {
        return localization.missingBooking;
    }

    // Only able to have 1 booking at a time
    const booking = userBookings[0];

    const calendarEventInput = removeCalendarEvent(events, booking);
    booking.status = BorrowStatus.pickedUp;
    calendarEventInput.push(booking);

    const missingAccessories = updateMissingAccessories(
        item.missingAccessories,
        missing,
        item.advertBorrowCalendar.calendarEvents,
        user,
    );

    const updateInput = mapAdvertToUpdateInput(item);

    await API.graphql(
        graphqlOperation(updateAdvert, {
            input: {
                ...updateInput,
                missingAccessories,
                advertBorrowCalendar: {
                    ...item.advertBorrowCalendar,
                    calendarEvents: calendarEventInput,
                },
            } as UpdateAdvertInput,
        }),
    );

    return undefined;
}
