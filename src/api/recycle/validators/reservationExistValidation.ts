import { User } from '../../../contexts/UserContext';
import { AdvertPickUpInput } from '../../../graphql/models';
import { localization } from '../../../localizations';

export default function reservationExistValidation(
    pickupList: AdvertPickUpInput[],
    user: User,
): string | undefined {
    const userHasReservation = pickupList.some((pickUp) => {
        return pickUp.reservedBySub === user.sub && !pickUp.pickedUp;
    });

    return userHasReservation ? undefined : localization.missingReservation;
}
