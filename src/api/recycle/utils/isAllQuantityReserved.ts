import { AdvertPickUpInput } from '../../../graphql/models';

export default function isAllQuantityReserved(
    pickUps: AdvertPickUpInput[],
    totalQuantity: number | undefined | null,
): boolean {
    // endless supply or to much to count
    if (!totalQuantity && totalQuantity !== 0) {
        return false;
    }

    const reservedQuantity = pickUps
        .map((pickUp) => pickUp.quantity)
        .reduce((a, b) => a + b, 0);

    return reservedQuantity >= totalQuantity;
}
