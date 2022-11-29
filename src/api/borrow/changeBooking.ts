/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import {
    getUserBookings,
    mapCalendarToInput,
    removeCalendarEvent,
} from './utils';
import { mapAdvertToUpdateInput } from './mappers';
import { getItemFromApi } from '../items';
import { localization } from '../../localizations';
import { validateCalendarEvent } from './validators';

export default async function changeBooking(
    itemId: string,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    user: User,
    quantity: number | null | undefined = 1,
): Promise<string | undefined> {
    const item = await getItemFromApi(itemId);

    if (!item) {
        return localization.getBookingFromServerError;
    }

    if (!item.advertBorrowCalendar) {
        return localization.itemMissingCalendar;
    }

    const { allowedDateStart, allowedDateEnd, calendarEvents } =
        item.advertBorrowCalendar;
    const events = mapCalendarToInput(calendarEvents);

    const userBookings = getUserBookings(events, user);
    if (userBookings.length === 0) {
        return localization.missingPermissions;
    }

    // Only able to have 1 booking at a time
    const booking = userBookings[0];

    const calendarEventInput = removeCalendarEvent(events, booking);
    booking.dateStart = startDate;
    booking.dateEnd = endDate;
    booking.quantity = quantity;

    const validationMessage = validateCalendarEvent(
        calendarEventInput,
        allowedDateStart,
        allowedDateEnd,
        booking,
        quantity ?? 1,
    );

    // Validation error return message
    if (validationMessage) {
        return validationMessage;
    }

    const updateInput = mapAdvertToUpdateInput(item);

    await API.graphql(
        graphqlOperation(updateAdvert, {
            input: {
                ...updateInput,
                advertBorrowCalendar: {
                    ...item.advertBorrowCalendar,
                    calendarEvents: calendarEventInput,
                },
            },
        }),
    );

    return undefined;
}
