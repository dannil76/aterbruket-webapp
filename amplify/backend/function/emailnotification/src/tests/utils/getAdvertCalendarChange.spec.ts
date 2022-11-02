import { getAdvertCalendarChange } from '../../utils';
import { AdvertBorrowCalendarEvent } from '../../models/haffaAdvert';
import { BorrowStatus } from '../../models/enums';

describe('Handle advert calendar changes', () => {
    it('handle empty lists', () => {
        const previous = [];
        const updated = [];
        const actual = getAdvertCalendarChange(previous, updated);
        expect(actual).toBeUndefined();
    });

    it('handle first add', () => {
        const previous = [] as AdvertBorrowCalendarEvent[];
        const updated = [
            {
                borrowedBySub: 'sub',
                status: BorrowStatus.RESERVED,
                dateStart: new Date(0),
                dateEnd: new Date(10),
                returnDateTime: new Date(),
            },
        ] as AdvertBorrowCalendarEvent[];
        const actual = getAdvertCalendarChange(previous, updated);
        expect(actual).toBe(updated[0]);
    });

    it('handle no change', () => {
        const noChange = {
            borrowedBySub: 'sub',
            status: BorrowStatus.RESERVED,
            dateStart: new Date(0),
            dateEnd: new Date(10),
            returnDateTime: new Date(),
        };
        const previous = [noChange] as AdvertBorrowCalendarEvent[];
        const updated = [noChange] as AdvertBorrowCalendarEvent[];
        const actual = getAdvertCalendarChange(previous, updated);
        expect(actual).toBeUndefined();
    });

    it('handle picked up', () => {
        const first = {
            borrowedBySub: 'sub',
            status: BorrowStatus.RETURNED,
            dateStart: new Date(0),
            dateEnd: new Date(10),
            returnDateTime: new Date(),
        };
        const second = {
            borrowedBySub: 'sub',
            status: BorrowStatus.RESERVED,
            dateStart: new Date(20),
            dateEnd: new Date(30),
            returnDateTime: undefined,
        };
        const changed = {
            borrowedBySub: 'sub',
            status: BorrowStatus.PICKEDUP,
            dateStart: new Date(20),
            dateEnd: new Date(30),
            returnDateTime: undefined,
        };
        const third = {
            borrowedBySub: 'sub',
            status: BorrowStatus.RESERVED,
            dateStart: new Date(40),
            dateEnd: new Date(50),
            returnDateTime: undefined,
        };
        const previous = [first, second, third] as AdvertBorrowCalendarEvent[];
        const updated = [first, changed, third] as AdvertBorrowCalendarEvent[];
        const actual = getAdvertCalendarChange(previous, updated);
        expect(actual).toBe(changed);
    });

    it('handle return returned', () => {
        const first = {
            borrowedBySub: 'sub',
            status: BorrowStatus.RETURNED,
            dateStart: new Date(0),
            dateEnd: new Date(10),
            returnDateTime: new Date(),
        };
        const second = {
            borrowedBySub: 'sub',
            status: BorrowStatus.PICKEDUP,
            dateStart: new Date(20),
            dateEnd: new Date(30),
            returnDateTime: undefined,
        };
        const changed = {
            borrowedBySub: 'sub',
            status: BorrowStatus.RETURNED,
            dateStart: new Date(20),
            dateEnd: new Date(30),
            returnDateTime: new Date(),
        };
        const third = {
            borrowedBySub: 'sub',
            status: BorrowStatus.RESERVED,
            dateStart: new Date(40),
            dateEnd: new Date(50),
            returnDateTime: new Date(),
        };
        const previous = [first, second, third] as AdvertBorrowCalendarEvent[];
        const updated = [first, changed, third] as AdvertBorrowCalendarEvent[];
        const actual = getAdvertCalendarChange(previous, updated);
        expect(actual).toBe(changed);
    });
});
