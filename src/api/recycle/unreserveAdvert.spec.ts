import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { unreserveAdvert } from '.';
import { mapPickUpsToInput, mapAdvertToCreateInput } from './mappers';
import { User } from '../../contexts/UserContext';
import { Advert } from '../../graphql/models';
import { getItemFromApi } from '../items';
import { reservationExistValidation } from './validators';

jest.mock('aws-amplify');
jest.mock('@aws-amplify/api');
jest.mock('./utils', () => {
    return {
        isAllQuantityReserved: jest.fn(),
        removeFromPickupList: jest.fn(),
        getUpdatedItemStatus: jest.fn(),
    };
});
jest.mock('./validators', () => {
    return {
        reservationExistValidation: jest.fn(),
    };
});
jest.mock('./mappers', () => {
    return {
        mapAdvertToCreateInput: jest.fn(),
        mapPickUpsToInput: jest.fn(),
    };
});

jest.mock('../items', () => {
    return {
        getItemFromApi: jest.fn(),
    };
});

describe('Reserve advert', () => {
    const setUpdated = jest.fn();
    const advert = {
        id: 'abc',
        advertPickUps: [],
    } as unknown as Advert;
    const user = {} as User;
    const graphqlMock = API.graphql as jest.Mock;
    const graphqlOperationMock = graphqlOperation as jest.Mock;
    const mapPickUpsToInputMock = mapPickUpsToInput as jest.Mock;
    const mapAdvertToCreateInputMock = mapAdvertToCreateInput as jest.Mock;
    const getItemFromApiMock = getItemFromApi as jest.Mock;
    const reservationExistValidationMock =
        reservationExistValidation as jest.Mock;

    beforeEach(() => {
        setUpdated.mockReset();
        graphqlMock.mockReset();
        graphqlOperationMock.mockReset();
        mapPickUpsToInputMock.mockReset();
        mapAdvertToCreateInputMock.mockReset();
        graphqlMock.mockReturnValue(Promise.resolve());
        graphqlOperationMock.mockReturnValue({});
        mapPickUpsToInputMock.mockReturnValue([]);
        mapAdvertToCreateInputMock.mockReturnValue({});
        getItemFromApiMock.mockReturnValue(Promise.resolve(advert));
        reservationExistValidationMock.mockReturnValue(undefined);
    });
    test('First reservation', async () => {
        const message = await unreserveAdvert(advert.id, user, setUpdated);
        expect(message).toBeUndefined();
        expect(API.graphql).toHaveBeenCalled();
        expect(setUpdated).toHaveBeenCalledWith(true);
    });

    test('Missing reservation', async () => {
        reservationExistValidationMock.mockReturnValue('error');
        const message = await unreserveAdvert(advert.id, user, setUpdated);
        expect(message).toBe('error');
        expect(API.graphql).not.toHaveBeenCalled();
    });
});
