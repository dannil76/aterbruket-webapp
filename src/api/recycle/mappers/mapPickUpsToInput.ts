/* eslint-disable @typescript-eslint/naming-convention */
import { AdvertPickUp, AdvertPickUpInput } from '../../../graphql/models';

export default function mapPickUpsToInput(
    pickUps: (AdvertPickUp | null)[] | undefined | null,
): AdvertPickUpInput[] {
    const advertPickUps = pickUps ?? ([] as AdvertPickUp[]);
    return advertPickUps.map((pickup) => {
        const { __typename, ...pickupInput } = { ...pickup };
        return pickupInput as AdvertPickUpInput;
    });
}
