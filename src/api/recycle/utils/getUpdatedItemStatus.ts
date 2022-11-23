import { AdvertPickUpInput, ItemStatus } from '../../../graphql/models';

export default function getUpdatedItemStatus(
    pickUps: AdvertPickUpInput[] | undefined,
    advertQuantity: number | undefined | null,
): ItemStatus {
    if (!pickUps || pickUps.length === 0) {
        return ItemStatus.available;
    }

    if (!advertQuantity || advertQuantity <= 0) {
        // Always available
        return ItemStatus.available;
    }

    let pickedUpQuantity = 0;
    let reservedQuantity = 0;

    pickUps.forEach((reservation) => {
        if (reservation.pickedUp) {
            pickedUpQuantity += reservation.quantity;
        } else {
            reservedQuantity += reservation.quantity;
        }
    });

    if (pickedUpQuantity >= advertQuantity) {
        return ItemStatus.pickedUp;
    }

    if (reservedQuantity + pickedUpQuantity >= advertQuantity) {
        return ItemStatus.reserved;
    }

    return ItemStatus.available;
}
