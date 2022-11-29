import { AdvertPickUp } from '../../../graphql/models';
import { localization } from '../../../localizations';

export default function reservationOverflowValidation(
    pickupList: AdvertPickUp[],
    reservationQuantity: number,
    totalQuantity: number,
    quantityUnit: string | undefined | null,
): string | undefined {
    const alreadyReserved = pickupList.reduce((acc, current) => {
        return acc + current.quantity;
    }, 0);

    const unit = quantityUnit ?? localization.quantityUnitDefault;
    const overflow =
        totalQuantity > 0 &&
        alreadyReserved + reservationQuantity > totalQuantity;
    if (overflow) {
        const left = totalQuantity - alreadyReserved;
        return localization.reservationOverflowError
            .replaceAll('{left}', `${left}`)
            .replaceAll('{quantityUnit}', `${unit}`)
            .replaceAll('{quantity}', `${reservationQuantity}`);
    }

    return undefined;
}
