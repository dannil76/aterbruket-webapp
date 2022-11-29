import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { reserveAdvert } from '.';
import { mapPickUpsToInput, mapAdvertToCreateInput } from './mappers';
import { User } from '../../contexts/UserContext';
import { Advert } from '../../graphql/models';
import { getItemFromApi } from '../items';
import {
    reservationOverflowValidation,
    duplicateReservationValidation,
} from './validators';

jest.mock('aws-amplify');
jest.mock('@aws-amplify/api');
jest.mock('./utils', () => {
    return {
        isAllQuantityReserved: jest.fn(),
        getUpdatedItemStatus: jest.fn(),
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

jest.mock('./validators', () => {
    return {
        reservationOverflowValidation: jest.fn(),
        duplicateReservationValidation: jest.fn(),
    };
});

describe('Reserve advert', () => {
    const setUpdated = jest.fn();
    const advert = {
        id: 'abc',
        advertPickUps: [{}],
    } as unknown as Advert;
    const user = {} as User;
    const graphqlMock = API.graphql as jest.Mock;
    const graphqlOperationMock = graphqlOperation as jest.Mock;
    const mapPickUpsToInputMock = mapPickUpsToInput as jest.Mock;
    const mapAdvertToCreateInputMock = mapAdvertToCreateInput as jest.Mock;
    const getItemFromApiMock = getItemFromApi as jest.Mock;
    const reservationOverflowValidationMock =
        reservationOverflowValidation as jest.Mock;
    const duplicateReservationValidationMock =
        duplicateReservationValidation as jest.Mock;
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
        reservationOverflowValidationMock.mockReturnValue(undefined);
        duplicateReservationValidationMock.mockReturnValue(undefined);
    });
    test('First reservation', async () => {
        const message = await reserveAdvert(advert.id, user, 1, setUpdated);
        expect(message).toBeUndefined();
        expect(API.graphql).toHaveBeenCalled();
        expect(setUpdated).toHaveBeenCalledWith(true);
        expect(mapPickUpsToInput).toHaveBeenCalledWith(advert.advertPickUps);
    });

    test('Overflow error', async () => {
        reservationOverflowValidationMock.mockReturnValue('error');
        const message = await reserveAdvert(advert.id, user, 1, setUpdated);
        expect(message).toBe('error');
        expect(API.graphql).not.toHaveBeenCalled();
    });

    test('Duplicate error', async () => {
        duplicateReservationValidationMock.mockReturnValue('error');
        const message = await reserveAdvert(advert.id, user, 1, setUpdated);
        expect(message).toBe('error');
        expect(API.graphql).not.toHaveBeenCalled();
    });
});
