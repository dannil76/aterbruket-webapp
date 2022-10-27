import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { Event } from '../models/awsEvent';

export async function getUserGroups(event: Event): Promise<string[]> {
    const cisp = new CognitoIdentityServiceProvider();

    const request = {
        UserPoolId: event.userPoolId,
        Username: event.userName,
    };

    const response = await cisp.adminListGroupsForUser(request).promise();

    if (!response.Groups) {
        return [];
    }

    return response.Groups.map((group) => {
        return group.GroupName ?? '';
    }).filter((group) => !!group);
}

export async function addUserToGroup(event: Event): Promise<void> {
    const cisp = new CognitoIdentityServiceProvider();

    const request = {
        GroupName: 'user',
        UserPoolId: event.userPoolId,
        Username: event.userName,
    };

    await cisp.adminAddUserToGroup(request).promise();
}

export async function updateUser(event: Event): Promise<void> {
    const cisp = new CognitoIdentityServiceProvider();

    const request = {
        UserPoolId: event.userPoolId,
        Username: event.userName,
        UserAttributes: [
            {
                Name: 'custom:newUser',
                Value: 'false',
            },
        ],
    };

    await cisp.adminUpdateUserAttributes(request).promise();
}
