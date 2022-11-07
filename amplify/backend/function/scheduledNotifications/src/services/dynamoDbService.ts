import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Advert } from '../models/advert';
import { logDebug, logException, dateToDayString } from '../utils';
import { apiGraphqlOutput, environment } from '../config';

export default async function getReservations(
    reservationDate: Date,
): Promise<Advert[]> {
    const table = `Advert-${apiGraphqlOutput}-${environment}`;
    const advertVersion = 0;
    logDebug(`table: ${table}`);
    const client = new DocumentClient();
    const reservationDateValue = dateToDayString(reservationDate);

    logDebug(`try to find date: ${reservationDateValue}`);

    try {
        const reservations = await client
            .query({
                TableName: table,
                IndexName: 'byStatusAndReservationDateAndVersion',
                KeyConditionExpression:
                    '#S = :statusValue AND #R = :reservationDateValue',
                ExpressionAttributeNames: {
                    '#S': 'status',
                    '#R': 'reservationDate#version',
                },
                ExpressionAttributeValues: {
                    ':statusValue': 'reserved',
                    ':reservationDateValue': `${reservationDateValue}#${advertVersion}`,
                },
                ProjectionExpression:
                    'reservedBySub, contactPerson, department, email, phoneNumber, title',
            })
            .promise();

        logDebug(`Found: ${reservations.Count}`);
        return reservations.Items.map((item) => {
            return {
                id: item.id,
                version: item.version,
                reservedBySub: item.reservedBySub,
                contactPerson: item.contactPerson,
                department: item.department,
                email: item.email,
                phoneNumber: item.phoneNumber,
                title: item.title,
            } as Advert;
        });
    } catch (error) {
        const err = error as Error;
        logException(err?.message ?? error);
        throw error;
    }
}
