import { User } from '../../../contexts/UserContext';
import { AdvertPickUpInput } from '../../../graphql/models';
import { localization } from '../../../localizations';

export default function duplicateReservationValidation(
    pickupList: AdvertPickUpInput[],
    user: User,
): string | undefined {
    const userHasReservation = pickupList.some((pickUp) => {
        return pickUp.reservedBySub === user.sub && !pickUp.pickedUp;
    });

    return userHasReservation ? localization.duplicateReservations : undefined;
}
