import { HaffaUser } from 'models/haffaUser';
import { AwsUser } from './awsUser';
import Config from '../config';
import { logDebug, logException } from './logHelper';

const config = new Config();
const awsUser = new AwsUser();

export default async function getReservedByUser(
    subscriptionId: string,
): Promise<HaffaUser | undefined> {
    logDebug(`[getReservedByUser] try get user with sub:${subscriptionId}`);
    if (!subscriptionId) {
        logDebug('[getReservedByUser] missing subscription');
        return undefined;
    }

    try {
        const haffaUser = await awsUser.getUserBySub(
            config.userPoolId,
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
        const typedError = error as Error;
        if (typedError) {
            logException(
                `[getReservedByUser] failed get user by sub from cognito`,
            );
        }

        return undefined;
    }
}
