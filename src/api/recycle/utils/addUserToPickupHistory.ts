import { User } from '../../../contexts/UserContext';
import { Advert } from '../../../graphql/models';

export default function addUserToPickupHistory(
    item: Advert,
    user: User,
): string[] {
    const history = [...(item.pickedUpBySubs ?? [])];

    const alreadyIncluded = history.some((sub) => sub === user.sub);
    if (!alreadyIncluded) {
        history.push(user.sub);
    }

    return history;
}
