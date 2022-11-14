import { User } from '../../../contexts/UserContext';
import { AdvertPickUpInput } from '../../../graphql/models';

export default function removeFromPickupList(
    pickUps: AdvertPickUpInput[],
    user: User,
): AdvertPickUpInput[] {
    return pickUps.filter((pickUp) => {
        return pickUp.reservedBySub !== user.sub || pickUp.pickedUp;
    });
}
