/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import React from 'react';
import { createAdvert, updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { Advert, UpdateAdvertMutation } from '../../graphql/models';
import { dayToDateString } from '../../utils';
import { mapAdvertToCreateInput, mapPickUpsToInput } from './mappers';
import { getUpdatedItemStatus } from './utils';

export default async function ReserveAdvert(
    item: Advert | undefined,
    user: User,
    quantity: number,
    setUpdated: (value: React.SetStateAction<boolean>) => void,
): Promise<string | undefined> {
    if (!item) {
        return 'missing item';
    }

    const advertPickUps = mapPickUpsToInput(item.advertPickUps);
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
