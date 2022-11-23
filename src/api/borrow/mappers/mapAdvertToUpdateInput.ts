/* eslint-disable @typescript-eslint/naming-convention */
import { Advert, UpdateAdvertInput } from '../../../graphql/models';

export default function mapAdvertToUpdateInput(
    advert: Advert,
): UpdateAdvertInput {
    const { __typename, createdAt, updatedAt, ...advertInput } = { ...advert };
    return advertInput as UpdateAdvertInput;
}
