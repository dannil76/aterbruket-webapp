/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { BorrowStatus, CalendarEventInput } from '../../graphql/models';
import { addUserToPickupList, mapCalendarToInput } from './utils';
import { mapAdvertToUpdateInput } from './mappers';
import { HaffaApiError } from '../../models/ApiError';
import { getItemFromApi } from '../items';
import { localization } from '../../localizations';
import {
    duplicateBookingValidation,
    validateCalendarEvent,
} from './validators';

export default async function addBooking(
    itemId: string,
    user: User,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    quantity: number | null | undefined = 1,
): Promise<string | undefined> {
    if (!quantity || quantity < 1) {
        return localization.addBookingQuantityError;
    }

    const calendarEvent = {
        borrowedBySub: user.sub,
        dateStart: startDate,
        dateEnd: endDate,
        status: BorrowStatus.reserved,
        quantity,
    } as CalendarEventInput;

    const item = await getItemFromApi(itemId);
    if (!item) {
        return localization.getBookingFromServerError;
    }

    if (!item.advertBorrowCalendar) {
        return localization.itemMissingCalendar;
    }

    const { allowedDateStart, allowedDateEnd, calendarEvents } =
        item.advertBorrowCalendar;

    const calendarEventInputs = mapCalendarToInput(calendarEvents);

    const duplicateBookings = duplicateBookingValidation(
        calendarEventInputs,
        user,
    );

    if (duplicateBookings) {
        return duplicateBookings;
    }

    const validationMessage = validateCalendarEvent(
        calendarEventInputs,
        allowedDateStart,
        allowedDateEnd,
        calendarEvent,
        item.quantity ?? 1,
    );

    if (validationMessage) {
        return validationMessage;
    }

    const toPickUpBySubs = addUserToPickupList(item, user);

    calendarEventInputs.push(calendarEvent);

    const createAdvert = mapAdvertToUpdateInput(item);

    try {
        await API.graphql(
            graphqlOperation(updateAdvert, {
                input: {
                    ...createAdvert,
                    advertBorrowCalendar: {
                        ...item.advertBorrowCalendar,
                        calendarEvents: calendarEventInputs,
                    },
                    toPickUpBySubs,
                },
            }),
        );
    } catch (error) {
        if (typeof error === 'string') {
            return error;
        }

        const err = error as HaffaApiError;

        return (
            err?.errors[0]?.message ??
            `${localization.unknownSaveError} ${err?.errors[0]?.message}`
        );
    }

    return undefined;
}
