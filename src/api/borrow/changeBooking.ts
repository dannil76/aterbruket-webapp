/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { Advert } from '../../graphql/models';
import {
    getUserBookings,
    mapCalendarToInput,
    removeCalendarEvent,
    validateCalendarEvent,
} from './utils';

export default async function changeBooking(
    advert: Advert,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    user: User,
    quantity: number | null | undefined = 1,
): Promise<string | undefined> {
    if (!advert.advertBorrowCalendar) {
        return 'Bokningen saknar kalender';
    }

    const { allowedDateStart, allowedDateEnd, calendarEvents } =
        advert.advertBorrowCalendar;
    const events = mapCalendarToInput(calendarEvents);

    const userBookings = getUserBookings(events, user);
    if (userBookings.length === 0) {
        return 'Du saknar bokning att ändra';
    }

    // Only able to have 1 booking at a time
    const booking = userBookings[0];

    const advertBorrowCalendar = removeCalendarEvent(events, booking);
    booking.dateStart = startDate;
    booking.dateEnd = endDate;
    booking.quantity = quantity;

    const validationMessage = validateCalendarEvent(
        advertBorrowCalendar,
        allowedDateStart,
        allowedDateEnd,
        booking,
    );

    // Validation error return message
    if (validationMessage) {
        return validationMessage;
    }

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
