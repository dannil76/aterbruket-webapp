/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import React from 'react';
import { createAdvert, updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { UpdateAdvertMutation } from '../../graphql/models';
import { mapAdvertToCreateInput, mapPickUpsToInput } from './mappers';
import {
    addPickedUpStatus,
    addUserToPickupHistory,
    getUpdatedItemStatus,
    removeUserFromPickupList,
} from './utils';
import { getItemFromApi } from '../items';
import { localization } from '../../localizations';
import { reservationExistValidation } from './validators';

export default async function pickUpAdvert(
    itemId: string,
    user: User,
    setUpdated: (value: React.SetStateAction<boolean>) => void,
): Promise<string | undefined> {
    const item = await getItemFromApi(itemId);

    if (!item) {
        return localization.getBookingFromServerError;
    }

    if (!item.advertPickUps) {
        return localization.itemMissingPickupList;
    }

    let advertPickUps = mapPickUpsToInput(item.advertPickUps);

    const missingReservation = reservationExistValidation(advertPickUps, user);

    if (missingReservation) {
        return missingReservation;
    }

    advertPickUps = addPickedUpStatus(advertPickUps, user);

    const toPickUpBySubs = removeUserFromPickupList(item, user);
    const pickedUpBySubs = addUserToPickupHistory(item, user);

    const updateResult = (await API.graphql(
        graphqlOperation(updateAdvert, {
            input: {
                id: item.id,
                version: 0,
                advertPickUps,
                status: getUpdatedItemStatus(advertPickUps, item.quantity),
                revisions: (item.revisions ?? 0) + 1,
                toPickUpBySubs,
                pickedUpBySubs,
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
