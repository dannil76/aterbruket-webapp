import * as AWS from 'aws-sdk';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { SessionType } from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { HelsingborgUser } from 'models/helsingborgUser';
import Config from '../config';
import { logDebug, logException } from '../utils/logHelper';

const config = new Config();

interface UserAttribute {
    Name: string;
    Value: string;
}

function addAttribute(
    attributes: UserAttribute[],
    name: string,
    value: string,
): void {
    if (!value) {
        return;
    }

    attributes.push({ Name: name, Value: value });
}

async function createUser(
    cisp: CognitoIdentityServiceProvider,
    userName: string,
    password: string,
    userInfo: HelsingborgUser,
) {
    const userAttributes = [
        { Name: 'name', Value: userInfo.displayname },
        { Name: 'email', Value: userInfo.userprincipalname },
        { Name: 'email_verified', Value: 'true' },
    ] as UserAttribute[];

    addAttribute(userAttributes, 'address', userInfo.streetaddress);
    addAttribute(userAttributes, 'custom:postalcode', userInfo.postalcode);
    addAttribute(userAttributes, 'custom:department', userInfo.department);
    addAttribute(userAttributes, 'custom:company', userInfo.company);

    const createUserRequest = {
        UserPoolId: config.userPoolId,
        Username: userName,
        TemporaryPassword: password,
        MessageAction: 'SUPPRESS', // suppress the sending of an invitation to the user
        UserAttributes: userAttributes,
    };

    return cisp.adminCreateUser(createUserRequest).promise();
}

async function addUserToGroup(
    cisp: CognitoIdentityServiceProvider,
    userName: string,
) {
    const addUserToGroupRequest = {
        GroupName: 'user',
        UserPoolId: config.userPoolId,
        Username: userName,
    };

    return cisp.adminAddUserToGroup(addUserToGroupRequest).promise();
}

async function initiateAuth(
    cisp: CognitoIdentityServiceProvider,
    userName: string,
    password: string,
) {
    const updateUserRequest = {
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: config.clientId,
        UserPoolId: config.userPoolId,
        AuthParameters: { USERNAME: userName, PASSWORD: password },
    };

    return cisp.adminInitiateAuth(updateUserRequest).promise();
}

async function respondToAuthChallenge(
    cisp: CognitoIdentityServiceProvider,
    userIdForSrp: string,
    password: string,
    session: SessionType,
) {
    const updateAuthChallengeRequest = {
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ClientId: config.clientId,
        UserPoolId: config.userPoolId,
        ChallengeResponses: {
            NEW_PASSWORD: password,
            USERNAME: userIdForSrp,
        },
        Session: session,
    };

    return cisp
        .adminRespondToAuthChallenge(updateAuthChallengeRequest)
        .promise();
}

export async function createCognitoUser(
    userName: string,
    password: string,
    userInfo: HelsingborgUser,
): Promise<void> {
    try {
        logDebug(`Try to create user ${userName} in cognito`);
        const cisp = new AWS.CognitoIdentityServiceProvider();
        await createUser(cisp, userName, password, userInfo);

        logDebug(`User ${userName} created in cognito`);
        await addUserToGroup(cisp, userName);

        logDebug(`User ${userName} was added to user group`);
        const initiateRespone = await initiateAuth(cisp, userName, password);

        logDebug(`Initiated auth for User ${userName}. Challenge retrieved: ${initiateRespone.ChallengeName}`);
        if (initiateRespone.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
            logDebug(`User ${userName} need new password. Respond to auth challenge`);
            await respondToAuthChallenge(
                cisp,
                initiateRespone.ChallengeParameters.USER_ID_FOR_SRP,
                password,
                initiateRespone.Session,
            );

            logDebug(`Responded to auth challenge for User ${userName}.`);
        }
    } catch (err) {
        const typedError = err as Error;
        if (typedError) {
            logException(err.message);
        }

        throw err;
    }
}
