import { HaffaUser } from '../models/haffaUser';

export default function getFirstName(
    user: HaffaUser | string | undefined | null,
): string {
    if (!user) {
        return '';
    }

    if (!(typeof user === 'string') && !user.name) {
        return user.email;
    }

    const userName = typeof user === 'string' ? user : user.name;

    if (!userName) {
        return '';
    }

    const nameParts = userName.split(' ');
    const delimiterIndex = nameParts.indexOf('-');
    if (delimiterIndex > 0) {
        return nameParts[delimiterIndex - 1];
    }

    if (nameParts.length > 1) {
        return nameParts[nameParts.length - 1];
    }

    return userName;
}
