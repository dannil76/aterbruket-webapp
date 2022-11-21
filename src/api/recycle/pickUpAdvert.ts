/* eslint-disable @typescript-eslint/naming-convention */
import { API } from 'aws-amplify';
import { graphqlOperation, GraphQLResult } from '@aws-amplify/api';
import React from 'react';
import { createAdvert, updateAdvert } from '../../graphql/mutations';
import { User } from '../../contexts/UserContext';
import { Advert, UpdateAdvertMutation } from '../../graphql/models';
import { mapAdvertToCreateInput, mapPickUpsToInput } from './mappers';
import { addPickedUpStatus } from './utils';

export default async function pickUpAdvert(
    item: Advert,
    user: User,
    setUpdated: (value: React.SetStateAction<boolean>) => void,
): Promise<string | undefined> {
    let advertPickUps = mapPickUpsToInput(item.advertPickUps);
    advertPickUps = addPickedUpStatus(advertPickUps, user);

    const updateResult = (await API.graphql(
        graphqlOperation(updateAdvert, {
            input: {
                id: item.id,
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

    return undefined;
}
