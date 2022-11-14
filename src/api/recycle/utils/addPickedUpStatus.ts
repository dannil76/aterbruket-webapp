import { User } from '../../../contexts/UserContext';
import { AdvertPickUpInput } from '../../../graphql/models';

export default function addPickedUpStatus(
    pickUps: AdvertPickUpInput[],
    user: User,
): AdvertPickUpInput[] {
    return pickUps.map((pickUp) => {
        if (pickUp.reservedBySub !== user.sub || pickUp.pickedUp) {
            return pickUp;
        }

        const { ...updated } = { ...pickUp };
        updated.pickedUp = true;
        return updated;
    });
}
