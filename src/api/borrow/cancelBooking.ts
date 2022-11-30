/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { BorrowStatus } from '../../graphql/models';
import {
    mapCalendarToInput,
    getUserBookings,
    removeCalendarEvent,
    removeUserFromPickupList,
} from './utils';
import { mapAdvertToUpdateInput } from './mappers';
import { getItemFromApi } from '../items';
import { localization } from '../../localizations';
import { hasBookingValidation } from './validators';

export default async function cancelBooking(
    itemId: string,
    user: User,
): Promise<string | undefined> {
    const item = await getItemFromApi(itemId);

    if (!item) {
        return localization.getBookingFromServerError;
    }

    const events = mapCalendarToInput(
        item.advertBorrowCalendar?.calendarEvents,
    );

    const missingBooking = hasBookingValidation(events, user);

    if (missingBooking) {
        return missingBooking;
    }

    const userBookings = getUserBookings(events, user);

    if (userBookings.length === 0) {
        return localization.missingBooking;
    }

    // Only able to have 1 booking at a time
    const booking = userBookings[0];

    const calendarEventInput = removeCalendarEvent(events, booking);
    booking.status = BorrowStatus.cancelled;
    calendarEventInput.push(booking);

    const updateInput = mapAdvertToUpdateInput(item);

    const toPickUpBySubs = removeUserFromPickupList(item, user);

    await API.graphql(
        graphqlOperation(updateAdvert, {
            input: {
                ...updateInput,
                advertBorrowCalendar: {
                    ...item.advertBorrowCalendar,
                    calendarEvents: calendarEventInput,
                },
                toPickUpBySubs,
            },
        }),
    );

    return undefined;
}
