import { Advert, ItemAdvertType } from '../graphql/models';

export default function getRecycleInventory(advert: Advert): number {
    if (advert.advertType !== ItemAdvertType.recycle) {
        return 0;
    }

    if (!advert.quantity || advert.quantity === 0) {
        return 0;
    }

    if (!advert.advertPickUps) {
        return advert.quantity;
    }

    const alreadyReserved = advert.advertPickUps.reduce((acc, current) => {
        return acc + current.quantity;
    }, 0);

    return advert.quantity - alreadyReserved;
}
