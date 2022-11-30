import { User } from '../../../contexts/UserContext';
import { Advert } from '../../../graphql/models';

export default function addUserToPickupList(
    item: Advert,
    user: User,
): string[] {
    const toPickupList = [...(item.toPickUpBySubs ?? [])];

    const alreadyIncluded = toPickupList.some((sub) => sub === user.sub);
    if (!alreadyIncluded) {
        toPickupList.push(user.sub);
    }

    return toPickupList;
}
