/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import React from 'react';
import { createAdvert, updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { Advert, ItemStatus, UpdateAdvertMutation } from '../../graphql/models';
import { dayToDateString } from '../../utils';
import { mapAdvertToCreateInput, mapPickUpsToInput } from './mappers';
import { isAllQuantityReserved, removeFromPickupList } from './utils';

export default async function UnreserveAdvert(
    item: Advert,
    user: User,
    setUpdated: (value: React.SetStateAction<boolean>) => void,
): Promise<void> {
    let advertPickUps = mapPickUpsToInput(item.advertPickUps);
    advertPickUps = removeFromPickupList(advertPickUps, user);
    const status = isAllQuantityReserved(advertPickUps, item.quantity)
        ? ItemStatus.reserved
        : ItemStatus.available;

    const updateResult = (await API.graphql(
        graphqlOperation(updateAdvert, {
            input: {
                id: item.id,
                status,
                reservedBySub: user.sub,
                reservedByName: user.name,
                reservationDate: dayToDateString(),
                version: 0,
                advertPickUps,
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
}
