import { getDateForReservationNotification } from '../utils';

const mockDate = new Date('2022-01-06T00:00:00.000Z');
const spy = jest
    .spyOn(global, 'Date')
    .mockImplementation(() => mockDate as unknown as string);

describe('get date', () => {
    afterAll(() => {
        spy.mockRestore();
    });

    it('for reservation notification', async () => {
        const actual = getDateForReservationNotification();
        expect(actual.toLocaleDateString()).toBe('1/1/2022');
    });
});
