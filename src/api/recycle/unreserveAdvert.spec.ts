import { API } from 'aws-amplify';
import { graphqlOperation } from '@aws-amplify/api';
import { unreserveAdvert } from '.';
import { mapPickUpsToInput, mapAdvertToCreateInput } from './mappers';
import { User } from '../../contexts/UserContext';
import { Advert } from '../../graphql/models';

jest.mock('aws-amplify');
jest.mock('@aws-amplify/api');
jest.mock('./utils', () => {
    return {
        isAllQuantityReserved: jest.fn(),
        removeFromPickupList: jest.fn(),
        getUpdatedItemStatus: jest.fn(),
    };
});
jest.mock('./mappers', () => {
    return {
        mapAdvertToCreateInput: jest.fn(),
        mapPickUpsToInput: jest.fn(),
    };
});

describe('Reserve advert', () => {
    const setUpdated = jest.fn();
    const advert = {} as Advert;
    const user = {} as User;
    const graphqlMock = API.graphql as jest.Mock;
    const graphqlOperationMock = graphqlOperation as jest.Mock;
    const mapPickUpsToInputMock = mapPickUpsToInput as jest.Mock;
    const mapAdvertToCreateInputMock = mapAdvertToCreateInput as jest.Mock;
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
    });
    test('First reservation', async () => {
        await unreserveAdvert(advert, user, setUpdated);
        expect(API.graphql).toHaveBeenCalled();
        expect(setUpdated).toHaveBeenCalledWith(true);
    });
});
