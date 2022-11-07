import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Advert } from '../models/advert';
import {
    logDebug,
    logException,
    getDateForReservationNotification,
} from '../utils';

function getDaysFromEnv() {
    const days = process.env.RESERVATION_DAYS_UNTIL_NOTIFICATIONS;
    const numberOfDays = Number.parseInt(days, 10);

    return Number.isNaN(numberOfDays) ? 0 : numberOfDays;
}

function getReservationDay() {
    const date = new Date();
    date.setDate(date.getDate() - getDaysFromEnv());
    return date;
}

export default async function getReservations(): Promise<Advert[]> {
    const environment = process.env.ENV;
    const apiGraphQLAPIIdOutput =
        process.env.API_ATERBRUKETWEBAPP_GRAPHQLAPIIDOUTPUT;
    const table = `Advert-${apiGraphQLAPIIdOutput}-${environment}`;

    logDebug(`table: ${table}`);
    const client = new DocumentClient();
    const reservationDate =
        getDateForReservationNotification().toLocaleDateString('sv-SE', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
        });

    logDebug(`try to find date: ${reservationDate}`);

    try {
        const reservations = await client
            .query({
                TableName: table,
                IndexName: 'byStatusAndReservationDateAndVersion',
                KeyConditionExpression:
                    '#S = :statusValue AND #R = :reservationDateValue AND #V = :version',
                ExpressionAttributeNames: {
                    '#S': 'status',
                    '#R': 'reservationDate',
                    '#V': 'version',
                },
                ExpressionAttributeValues: {
                    ':statusValue': 'reserved',
                    ':reservationDateValue': reservationDate,
                    ':version': 0,
                },
                ProjectionExpression: 'reservedBySub',
            })
            .promise();

        logDebug(`Found: ${reservations.Count}`);
        return reservations.Items.map((item) => {
            return {
                id: item.id,
                version: item.version,
                reservedBySub: item.reservedBySub,
            } as Advert;
        });
    } catch (error) {
        const err = error as Error;
        logException(err?.message ?? error);
        throw error;
    }
}
