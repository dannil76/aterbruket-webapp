import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk';
import { logDebug, logException, dateToDayString } from '../../utils';
import { getBorrowedItems, getReservations } from '../../services';
import { Borrowed, Reservation } from '../../models';

const queryPromiseMock = jest.fn();
const queryMock = jest.fn();
jest.mock('../../utils', () => {
    return {
        logDebug: jest.fn(),
        logException: jest.fn(),
        dateToDayString: jest.fn(),
    };
});
jest.mock('../../config', () => {
    return {
        apiGraphqlOutput: 'gql',
        environment: 'release',
    };
});
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
    const dateToDayStringMock = dateToDayString as jest.Mock;
    const queryResult = {} as PromiseResult<
        DocumentClient.QueryOutput,
        AWSError
    >;

    beforeEach(() => {
        logDebugMock.mockReset();
        logExceptionMock.mockReset();
        queryMock.mockReset();
        queryPromiseMock.mockReset();
        dateToDayStringMock.mockReset();
        queryMock.mockReturnValue({ promise: queryPromiseMock });
    });

    it('get reservations from dynamodb', async () => {
        const expectedQuery = {
            ExpressionAttributeNames: {
                '#S': 'status',
                '#R': 'reservationDate#version',
            },
            ExpressionAttributeValues: {
                ':reservationDateValue': '2022-01-01#0',
                ':statusValue': 'reserved',
            },
            IndexName: 'byStatusAndReservationDateAndVersion',
            KeyConditionExpression:
                '#S = :statusValue AND #R = :reservationDateValue',
            ProjectionExpression:
                'id, reservedBySub, contactPerson, department, email, phoneNumber, title',
            TableName: 'Advert-gql-release',
        };
        queryResult.Items = [
            {
                id: '123',
                version: 1,
                reservedBySub: 'abc123',
                contactPerson: 'first last',
                department: 'återbruk',
                email: 'aterbruk@helsingborg.se',
                phoneNumber: '070123123',
                title: 'reservation',
            } as Reservation,
        ];
        queryResult.Count = 1;
        const date = new Date('2022-01-01T00:00:00.000Z');
        queryPromiseMock.mockReturnValue(Promise.resolve(queryResult));
        dateToDayStringMock.mockReturnValue('2022-01-01');
        const actual = await getReservations(date);

        expect(actual.length).toBe(1);
        expect(queryMock).toHaveBeenCalledWith(expectedQuery);
        expect(dateToDayString).toHaveBeenCalledWith(date);
        expect(logDebug).toHaveBeenCalledWith('table: Advert-gql-release');
        expect(logDebug).toHaveBeenCalledWith('try to find date: 2022-01-01');
        expect(logDebug).toHaveBeenCalledWith('Found: 1');
        expect(actual[0].id).toBe('123');
        expect(actual[0].version).toBe(1);
        expect(actual[0].reservedBySub).toBe('abc123');
    });

    it('get borrowed from dynamodb', async () => {
        const expectedQuery = {
            ExpressionAttributeNames: {
                '#S': 'status',
                '#R': 'returnDate',
            },
            ExpressionAttributeValues: {
                ':returnDateValue': '2022-01-01',
                ':statusValue': 'pickedUp',
            },
            IndexName: 'byStatusAndReturnDate',
            KeyConditionExpression:
                '#S = :statusValue AND #R = :returnDateValue',
            ProjectionExpression:
                'id, advertBorrowCalendar, contactPerson, department, email, phoneNumber, title',
            TableName: 'Advert-gql-release',
        };
        queryResult.Items = [
            {
                id: '123',
                version: 1,
                title: 'borrowed',
                advertBorrowCalendar: {
                    allowedDateStart: '2022-01-01',
                    allowedDateEnd: '2022-01-02',
                },
                contactPerson: 'contact person',
                department: 'återbruk',
                email: 'aterbruk@helsingborg.se',
                phone: '070231223',
            } as Borrowed,
        ];
        queryResult.Count = 1;
        const date = new Date('2022-01-01T00:00:00.000Z');
        queryPromiseMock.mockReturnValue(Promise.resolve(queryResult));
        dateToDayStringMock.mockReturnValue('2022-01-01');
        const actual = await getBorrowedItems(date);

        expect(actual.length).toBe(1);
        expect(queryMock).toHaveBeenCalledWith(expectedQuery);
        expect(dateToDayString).toHaveBeenCalledWith(date);
        expect(logDebug).toHaveBeenCalledWith('table: Advert-gql-release');
        expect(logDebug).toHaveBeenCalledWith('try to find date: 2022-01-01');
        expect(logDebug).toHaveBeenCalledWith('Found: 1');
        expect(actual[0].id).toBe('123');
        expect(actual[0].version).toBe(1);
    });
});
