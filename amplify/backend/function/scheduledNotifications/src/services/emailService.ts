import { SES } from 'aws-sdk';
import { logDebug, logException } from '../utils';

const emailService = new SES();
export default async function sendEmail(
    from: string,
    to: string[],
    subject: string,
    body: string,
): Promise<boolean> {
    logDebug(
        `[Email Service] Send e-mail 
        from '${from}' 
        to '${to}'`,
    );

    try {
        await emailService
            .sendEmail({
                Destination: {
                    ToAddresses: to,
                },
                Source: from,
                Message: {
                    Subject: { Data: subject },
                    Body: {
                        Html: { Data: body },
                    },
                },
            })
            .promise();
    } catch (error) {
        const typedError = error as Error;
        if (typedError) {
            logException(
                `[Email Service] Send e-mail failed with ${typedError.message}`,
            );
        }
        return false;
    }

    logDebug(`[Email Service] Email has been sent to ${to}`);

    return true;
}
