import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk';
import {
    logDebug,
    logException,
    getDateForReservationNotification,
} from '../utils';
import { getReservations } from '../services';

const queryPromiseMock = jest.fn();
const queryMock = jest.fn();
jest.mock('../utils');
jest.mock('aws-sdk/clients/dynamodb', () => {
    return {
        DocumentClient: jest.fn().mockImplementation(() => {
            return { query: queryMock };
        }),
    };
});

describe('DynamoDB service', () => {
    const logDebugMock = logDebug as jest.Mock;
    const logExceptionMock = logException as jest.Mock;
    const getDateMock = getDateForReservationNotification as jest.Mock;
    const queryResult = {} as PromiseResult<
        DocumentClient.QueryOutput,
        AWSError
    >;

    beforeEach(() => {
        logDebugMock.mockReset();
        logExceptionMock.mockReset();
        queryMock.mockReset();
        queryPromiseMock.mockReset();
        getDateMock.mockReset();
        queryMock.mockReturnValue({ promise: queryPromiseMock });
        getDateMock.mockReturnValue(new Date('2022-01-01T00:00:00.000Z'));
    });

    it('get reservations from dynamodb', async () => {
        const expectedQuery = {
            ExpressionAttributeNames: {
                '#S': 'status',
                '#R': 'reservationDate',
                '#V': 'version',
            },
            ExpressionAttributeValues: {
                ':reservationDateValue': '2022-01-01',
                ':statusValue': 'reserved',
                ':version': 0,
            },
            IndexName: 'byStatusAndReservationDateAndVersion',
            KeyConditionExpression:
                '#S = :statusValue AND #R = :reservationDateValue AND #V = :version',
            ProjectionExpression: 'reservedBySub',
            TableName: 'Advert-ABC-release',
        };
        queryResult.Items = [
            {
                id: '123',
                version: 1,
                reservedBySub: 'abc123',
            },
        ];
        queryResult.Count = 1;
        queryPromiseMock.mockReturnValue(Promise.resolve(queryResult));
        const actual = await getReservations();

        expect(actual.length).toBe(1);
        expect(queryMock).toHaveBeenCalledWith(expectedQuery);
        expect(logDebug).toHaveBeenCalledWith('table: Advert-ABC-release');
        expect(logDebug).toHaveBeenCalledWith('try to find date: 2022-01-01');
        expect(logDebug).toHaveBeenCalledWith('Found: 1');
        expect(actual[0].id).toBe('123');
        expect(actual[0].version).toBe(1);
        expect(actual[0].reservedBySub).toBe('abc123');
    });
});
