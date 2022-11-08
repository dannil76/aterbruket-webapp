import { HaffaUser } from '../models';
import { CognitoService } from '../services';
import { userPoolId } from '../config';
import { logDebug, logException } from '.';

export default async function getReservedByUser(
    subscriptionId: string,
): Promise<HaffaUser | undefined> {
    logDebug(`[getReservedByUser] try get user with sub:${subscriptionId}`);
    if (!subscriptionId) {
        logDebug('[getReservedByUser] missing subscription');
        return undefined;
    }

    try {
        const haffaUser = await CognitoService.getUserBySub(
            userPoolId,
            subscriptionId,
        );

        if (!haffaUser) {
            logDebug(
                `[sendPickedUpEmail] failed to find user by sub:${subscriptionId}`,
            );
        }

        logDebug(`Found user ${haffaUser.username}`);
        return haffaUser;
    } catch (error) {
        const message = (error as Error)?.message ?? error;
        logException(
            `[getReservedByUser] failed get user by sub:${subscriptionId} from cognito: ${message}`,
        );

        return undefined;
    }
}
