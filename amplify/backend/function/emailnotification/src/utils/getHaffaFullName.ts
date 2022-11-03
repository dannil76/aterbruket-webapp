import { HaffaUser } from '../models/haffaUser';

export default function getFullName(
    user: HaffaUser | string | undefined,
): string {
    if (!user) {
        return '';
    }

    const userName = typeof user === 'string' ? user : user.name;

    if (!userName) {
        return '';
    }

    const nameParts = userName.split(' ').reverse();
    const delimiterIndex = nameParts.indexOf('-');
    if (delimiterIndex > 0) {
        return nameParts.splice(delimiterIndex + 1).join(' ');
    }

    if (nameParts.length > 1) {
        return nameParts.join(' ');
    }

    return userName;
}
