/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import React from 'react';
import { createAdvert, updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { UpdateAdvertMutation } from '../../graphql/models';
import { dayToDateString } from '../../utils';
import { mapAdvertToCreateInput, mapPickUpsToInput } from './mappers';
import { getUpdatedItemStatus } from './utils';
import { getItemFromApi } from '../items';
import { localization } from '../../localizations';
import {
    duplicateReservationValidation,
    reservationOverflowValidation,
} from './validators';

export default async function ReserveAdvert(
    itemId: string,
    user: User,
    quantity: number,
    setUpdated: (value: React.SetStateAction<boolean>) => void,
): Promise<string | undefined> {
    const item = await getItemFromApi(itemId);
    if (!item) {
        return localization.getBookingFromServerError;
    }

    if (!item.advertPickUps) {
        return localization.itemMissingPickupList;
    }
    const advertPickUps = mapPickUpsToInput(item.advertPickUps);

    const overflow = reservationOverflowValidation(
        item.advertPickUps,
        quantity,
        item.quantity ?? 0,
        item.quantityUnit,
    );

    if (overflow) {
        return overflow;
    }

    const duplicateReservation = duplicateReservationValidation(
        item.advertPickUps,
        user,
    );

    if (duplicateReservation) {
        return duplicateReservation;
    }

    advertPickUps.push({
        reservedBySub: user.sub,
        quantity,
        reservationDate: dayToDateString(),
    });

    const updateResult = (await API.graphql(
        graphqlOperation(updateAdvert, {
            input: {
                id: item.id,
                version: 0,
                advertPickUps,
                status: getUpdatedItemStatus(advertPickUps, item.quantity),
                revisions: (item.revisions ?? 0) + 1,
            },
        }),
    )) as GraphQLResult<UpdateAdvertMutation>;

    setUpdated(true);
    const createAdvertInput = mapAdvertToCreateInput(
        item,
        updateResult?.data?.updateAdvert?.revisions,
    );
    await API.graphql(
        graphqlOperation(createAdvert, { input: createAdvertInput }),
    );

    return undefined;
}
