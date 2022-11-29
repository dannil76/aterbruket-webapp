/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { BorrowStatus, MissingAccessories } from '../../graphql/models';
import {
    getUserBookings,
    mapCalendarToInput,
    removeCalendarEvent,
} from './utils';
import { mapAdvertToUpdateInput } from './mappers';
import { AdvertAccessory } from '../../models/accessory';
import { getItemFromApi } from '../items';
import { localization } from '../../localizations';

export default async function returnItem(
    itemId: string,
    user: User,
    accessories: AdvertAccessory[] | undefined,
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
        return localization.missingPermissions;
    }

    // Only able to have 1 booking at a time
    const booking = userBookings[0];

    const calendarEventInput = removeCalendarEvent(events, booking);
    booking.status = BorrowStatus.returned;
    calendarEventInput.push(booking);

    let newlyMissing = [] as string[];
    if (accessories) {
        newlyMissing = accessories
            .map((accessory) => {
                if (accessory.checked) {
                    return undefined;
                }

                const missingBySub =
                    item.missingAccessories?.filter(
                        (missing) => missing?.reportedBy === user.sub,
                    ) ?? [];

                if (missingBySub.length === 0) {
                    return accessory.label;
                }

                const lastMissing = missingBySub[missingBySub.length - 1];

                if (!lastMissing) {
                    return accessory.label;
                }

                if (
                    lastMissing.accessories.every(
                        (missing) => missing !== accessory.id,
                    )
                ) {
                    return accessory.label;
                }

                return undefined;
            })
            .filter((accessory) => accessory) as string[];
    }

    const missingAccessories = {
        reportedBy: user.sub,
        reportedDate: new Date().toISOString(),
        accessories: newlyMissing,
        lastReturnedBy: user.sub,
    } as MissingAccessories;

    const updateInput = mapAdvertToUpdateInput(item);
    updateInput.missingAccessories = (item.missingAccessories ?? []).concat([
        missingAccessories,
    ]);

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
