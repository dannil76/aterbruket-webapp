/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { Advert, BorrowStatus, CalendarEventInput } from '../../graphql/models';
import { mapCalendarToInput, validateCalendarEvent } from './utils';
import { mapAdvertToUpdateInput } from './mappers';
import { HaffaApiError } from '../../models/ApiError';

export default async function addBooking(
    item: Advert,
    user: User,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    quantity: number | null | undefined = 1,
): Promise<string | undefined> {
    const calendarEvent = {
        borrowedBySub: user.sub,
        dateStart: startDate,
        dateEnd: endDate,
        status: BorrowStatus.reserved,
        quantity,
    } as CalendarEventInput;

    if (!item.advertBorrowCalendar) {
        return 'Bokningen saknar kalender';
    }

    const { allowedDateStart, allowedDateEnd, calendarEvents } =
        item.advertBorrowCalendar;

    const calendarEventInputs = mapCalendarToInput(calendarEvents);

    const validationMessage = validateCalendarEvent(
        calendarEventInputs,
        allowedDateStart,
        allowedDateEnd,
        calendarEvent,
    );

    // Validation error return message
    if (validationMessage) {
        return validationMessage;
    }

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
            `okänt fel inträffade vid sparande: ${err?.errors[0]?.message}`
        );
    }

    return undefined;
}
