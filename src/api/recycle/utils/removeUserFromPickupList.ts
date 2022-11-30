import { User } from '../../../contexts/UserContext';
import { Advert } from '../../../graphql/models';

export default function removeUserFromPickupList(
    item: Advert,
    user: User,
): string[] {
    const toPickupList = item.toPickUpBySubs ?? [];

    return toPickupList.filter((sub) => sub !== user.sub);
}
