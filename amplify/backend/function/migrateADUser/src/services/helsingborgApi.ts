import { IncomingMessage } from 'http';
import * as https from 'https';
import { HelsingborgUser } from 'models/helsingborgUser';
import Config from '../config';
import { logDebug, logException } from '../utils/logHelper';

const config = new Config();

function responseHandler<T>(
    res: IncomingMessage,
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason: unknown) => void,
): void {
    if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(
            new Error(
                `Recieved statuscode ${res.statusCode} from Helsingborg Intranet`,
            ),
        );
        return;
    }

    let response = '';
    res.on('data', function readData(chunk) {
        response += chunk;
    });

    res.on('end', function buildResponse() {
        try {
            logDebug('retrieved data from api');
            const data = JSON.parse(response) as T;
            resolve(data);
        } catch (err) {
            const typedError = err as Error;
            if (typedError) {
                logException(err.message);
            }

            logDebug(response);
            reject(new Error('Could not retrieve user from Helsingborg Api'));
        }
    });
}

export async function getHelsingborgUser(
    userName: string,
    password: string,
): Promise<HelsingborgUser> {
    const options = {
        host: config.helsingborgUrl,
        path: `${config.helsingborgUserRoute}/${userName}`,
        method: 'POST',
    };

    const body = {
        username: userName,
        password,
    };

    try {
        logDebug(`Try to get user ${userName} from Helsingborg Api`);
        const users = await new Promise<HelsingborgUser[]>(function sendRequest(
            resolve,
            reject,
        ) {
            const req = https.request(options, (res: IncomingMessage) =>
                responseHandler<HelsingborgUser[]>(res, resolve, reject),
            );

            req.write(JSON.stringify(body));
            req.end();
        });

        if (!users || users.length === 0 || !users[0].displayname) {
            throw new Error('User was not found or password is incorrect');
        }

        return users[0];
    } catch (err) {
        const typedError = err as Error;
        if (typedError) {
            logException(err.message);
        }

        throw err;
    }
}
