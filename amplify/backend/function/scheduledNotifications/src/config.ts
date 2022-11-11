import { logWarning, parseNumber } from './utils';

function getEnvironmentVariable(variable: string): string {
    const result = process.env[variable];
    if (!result) {
        logWarning(`[CONFIG] Missing environment variable ${variable}!`);
        return '';
    }

    return result;
}

export const userPoolId = getEnvironmentVariable(
    'AUTH_ATERBRUKETWEBAPP75287C9A_USERPOOLID',
);
export const environment = getEnvironmentVariable('ENV');
export const apiGraphqlOutput = getEnvironmentVariable(
    'API_ATERBRUKETWEBAPP_GRAPHQLAPIIDOUTPUT',
);
export const daysUntilPickUpReminder = parseNumber(
    getEnvironmentVariable('RESERVATION_DAYS_UNTIL_NOTIFICATIONS'),
);
export const daysUntilAutoCancellation = parseNumber(
    getEnvironmentVariable('RESERVATION_DAYS_UNTIL_CANCELLATION'),
);
export const daysBeforeReturnReminder = parseNumber(
    getEnvironmentVariable('BORROW_DAYS_BEFORE_REMINDER'),
);

export const senderEmail = getEnvironmentVariable('SES_SENDER_EMAIL');

export const appUrl = getEnvironmentVariable('SES_APP_URL');

export const opensearchUrl = getEnvironmentVariable('OPENSEARCH_URL');

export const region = getEnvironmentVariable('REGION');
