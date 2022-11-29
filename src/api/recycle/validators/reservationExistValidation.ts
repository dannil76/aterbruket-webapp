import { User } from '../../../contexts/UserContext';
import { AdvertPickUp } from '../../../graphql/models';
import { localization } from '../../../localizations';

export default function reservationExistValidation(
    pickupList: AdvertPickUp[],
    user: User,
): string | undefined {
    const userHasReservation = pickupList.some((pickUp) => {
        return pickUp.reservedBySub === user.sub && !pickUp.pickedUp;
    });

    return userHasReservation ? undefined : localization.missingReservation;
}
