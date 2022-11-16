/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { Advert, CalendarEventInput } from '../../graphql/models';
import { mapCalendarToInput, validateCalendarEvent } from './utils';

export default async function addBooking(
    item: Advert,
    user: User,
    startDate: string | null | undefined,
    endDate: string | null | undefined,
    eventType: string,
    quantity: number | null | undefined = 1,
): Promise<string | undefined> {
    const calendarEvent = {
        borrowedBySub: user.sub,
        dateStart: startDate,
        dateEnd: endDate,
        status: eventType,
        quantity,
    } as CalendarEventInput;

    if (!item.advertBorrowCalendar) {
        return 'Bokningen saknar kalender';
    }

    const { allowedDateStart, allowedDateEnd, calendarEvents } =
        item.advertBorrowCalendar;

    const advertBorrowCalendar = mapCalendarToInput(calendarEvents);

    const validationMessage = validateCalendarEvent(
        advertBorrowCalendar,
        allowedDateStart,
        allowedDateEnd,
        calendarEvent,
    );

    // Validation error return message
    if (validationMessage) {
        return validationMessage;
    }

    advertBorrowCalendar.push(calendarEvent);

    await API.graphql(
        graphqlOperation(updateAdvert, {
            input: {
                ...item,
                advertBorrowCalendar,
            },
        }),
    );

    return undefined;
}
