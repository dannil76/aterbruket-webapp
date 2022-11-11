import moment from 'moment';
import { ICalendarEvent } from '../interfaces/IDateRange';
import {
    addDateRangeToEvents,
    getLastReturnedCalendarEvent,
    isDateAvailable,
    updateEventStatus,
} from './calendarUtils';

describe('Create new calendar event', () => {
    const currentDay = moment();
    const twoDaysFromToday = moment().add(2, 'days');
    const sevenDaysFromToday = moment().add(7, 'days');

    const userSub1 = '11111-11111-11111-11111-11111';
    const userSub2 = '22222-22222-22222-22222-22222';

    const emptyCalendarEvents = {
        allowedDateStart: currentDay.format('YYYY-MM-DD'),
        allowedDateEnd: sevenDaysFromToday.format('YYYY-MM-DD'),
        calendarEvents: [],
    };

    const singleCalendarEvent = {
        allowedDateStart: currentDay.format('YYYY-MM-DD'),
        allowedDateEnd: sevenDaysFromToday.format('YYYY-MM-DD'),
        calendarEvents: [
            {
                borrowedBySub: userSub1,
                status: 'reserved',
                dateStart: currentDay.format('YYYY-MM-DD'),
                dateEnd: twoDaysFromToday.format('YYYY-MM-DD'),
            },
        ],
    };

    const eventTwoDayReservation: ICalendarEvent = {
        dateRange: {
            startDate: twoDaysFromToday.add(1, 'day').format('YYYY-MM-DD'),
            endDate: twoDaysFromToday.add(2, 'day').format('YYYY-MM-DD'),
        },
        eventType: 'reserved',
    };

    it('create first calendar event in empty calendar', () => {
        const expectedResult = {
            updateSuccessful: true,
            updatedCalendarResult: {
                ...emptyCalendarEvents,
                calendarEvents: [
                    {
                        borrowedBySub: userSub1,
                        status: eventTwoDayReservation.eventType,
                        dateEnd: eventTwoDayReservation.dateRange.endDate,
                        dateStart: eventTwoDayReservation.dateRange.startDate,
                    },
                ],
            },
        };

        const addedRangeResult = addDateRangeToEvents(
            emptyCalendarEvents,
            eventTwoDayReservation,
            userSub1,
        );

        expect(addedRangeResult).toEqual(expectedResult);
    });

    it('create first calendar event with allowed dates set to null', () => {
        const nullAllowedDateCalendar = {
            allowedDateStart: null,
            calendarEvents: [],
            allowedDateEnd: null,
        };

        const newCalendarEvent = {
            dateRange: {
                startDate: '2022-02-02',
                endDate: '2022-02-03',
            },
            eventType: 'reserved',
        };

        const userSub = '11111-11111-11111-11111-11111';

        const expectedResult = {
            updateSuccessful: true,
            updatedCalendarResult: {
                allowedDateStart: null,
                allowedDateEnd: null,
                calendarEvents: [
                    {
                        borrowedBySub: userSub,
                        dateStart: '2022-02-02',
                        dateEnd: '2022-02-03',
                        status: 'reserved',
                    },
                ],
            },
        };

        const addedRangeResult = addDateRangeToEvents(
            nullAllowedDateCalendar,
            newCalendarEvent,
            userSub,
        );

        expect(addedRangeResult).toEqual(expectedResult);
    });

    it('create second calendar event', () => {
        const expectedResult = {
            updateSuccessful: true,
            updatedCalendarResult: {
                ...singleCalendarEvent,
                calendarEvents: [
                    ...singleCalendarEvent.calendarEvents,
                    {
                        borrowedBySub: userSub2,
                        status: eventTwoDayReservation.eventType,
                        dateEnd: eventTwoDayReservation.dateRange.endDate,
                        dateStart: eventTwoDayReservation.dateRange.startDate,
                    },
                ],
            },
        };

        const addedRangeResult = addDateRangeToEvents(
            singleCalendarEvent,
            eventTwoDayReservation,
            userSub2,
        );

        expect(addedRangeResult).toEqual(expectedResult);
    });

    it('event shall not overlap with other events', () => {
        const calendar = {
            allowedDateStart: '2022-02-07',
            calendarEvents: [
                {
                    borrowedBySub: '3088c366-5092-4a70-a7f4-10cbe2fc6786',
                    dateEnd: '2022-02-11',
                    dateStart: '2022-02-09',
                    status: 'reserved',
                },
            ],
            allowedDateEnd: '2022-02-13',
        };

        const newEvent: ICalendarEvent = {
            dateRange: { startDate: '2022-02-08', endDate: '2022-02-12' },
            eventType: 'reserved',
        };

        const expectedResult = {
            errorMessage:
                'Prylen kan endast bokas under en sammanhängande period.',
            updateSuccessful: false,
            updatedCalendarResult: {
                allowedDateEnd: '2022-02-13',
                allowedDateStart: '2022-02-07',
                calendarEvents: [
                    {
                        borrowedBySub: '3088c366-5092-4a70-a7f4-10cbe2fc6786',
                        dateEnd: '2022-02-11',
                        dateStart: '2022-02-09',
                        status: 'reserved',
                    },
                ],
            },
        };

        expect(addDateRangeToEvents(calendar, newEvent, userSub2)).toEqual(
            expectedResult,
        );
    });

    it('event shall not overlap with other events in calendar with allowed dates set to null', () => {
        const nullAllowedDateCalendar = {
            allowedDateStart: null,
            calendarEvents: [
                {
                    borrowedBySub: '3088c366-5092-4a70-a7f4-10cbe2fc6786',
                    dateEnd: '2022-02-11',
                    dateStart: '2022-02-09',
                    status: 'reserved',
                },
            ],
            allowedDateEnd: null,
        };

        const newEvent: ICalendarEvent = {
            dateRange: { startDate: '2022-02-08', endDate: '2022-02-12' },
            eventType: 'reserved',
        };

        const expectedResult = {
            errorMessage:
                'Prylen kan endast bokas under en sammanhängande period.',
            updateSuccessful: false,
            updatedCalendarResult: {
                allowedDateEnd: null,
                allowedDateStart: null,
                calendarEvents: [
                    {
                        borrowedBySub: '3088c366-5092-4a70-a7f4-10cbe2fc6786',
                        dateEnd: '2022-02-11',
                        dateStart: '2022-02-09',
                        status: 'reserved',
                    },
                ],
            },
        };

        expect(
            addDateRangeToEvents(nullAllowedDateCalendar, newEvent, userSub2),
        ).toEqual(expectedResult);
    });

    it('new event is allowed to overlap with returned events', () => {
        const calendar = {
            allowedDateStart: '2022-02-08',
            calendarEvents: [
                {
                    borrowedBySub: '8409a340-a3a8-4aff-a6c4-55ae026d16a8',
                    dateEnd: '2022-02-11',
                    dateStart: '2022-02-08',
                    status: 'returned',
                },
            ],
            allowedDateEnd: '2022-02-28',
        };

        const newEvent: ICalendarEvent = {
            dateRange: { startDate: '2022-02-08', endDate: '2022-02-12' },
            eventType: 'reserved',
        };

        const expectedResult = {
            updateSuccessful: true,
            updatedCalendarResult: {
                allowedDateEnd: '2022-02-28',
                allowedDateStart: '2022-02-08',
                calendarEvents: [
                    {
                        borrowedBySub: '8409a340-a3a8-4aff-a6c4-55ae026d16a8',
                        dateEnd: '2022-02-11',
                        dateStart: '2022-02-08',
                        status: 'returned',
                    },
                    {
                        borrowedBySub: '22222-22222-22222-22222-22222',
                        dateEnd: '2022-02-12',
                        dateStart: '2022-02-08',
                        status: 'reserved',
                    },
                ],
            },
        };

        expect(addDateRangeToEvents(calendar, newEvent, userSub2)).toEqual(
            expectedResult,
        );
    });

    it('event shall not overlap with same dates', () => {
        const expectedResult = {
            updateSuccessful: false,
            errorMessage:
                'Prylen kan endast bokas under en sammanhängande period.',
            updatedCalendarResult: {
                ...singleCalendarEvent,
            },
        };

        const eventWithDuplicateDates = {
            dateRange: {
                startDate:
                    expectedResult.updatedCalendarResult.calendarEvents[0]
                        .dateStart,
                endDate:
                    expectedResult.updatedCalendarResult.calendarEvents[0]
                        .dateEnd,
            },
            eventType: 'reserved',
        };

        const tryAddingSameDates = addDateRangeToEvents(
            singleCalendarEvent,
            eventWithDuplicateDates,
            userSub2,
        );

        expect(tryAddingSameDates).toEqual(expectedResult);
    });

    it('event shall not overlap with another event start date', () => {
        const calendar = {
            allowedDateStart: currentDay.format('YYYY-MM-DD'),
            allowedDateEnd: sevenDaysFromToday.format('YYYY-MM-DD'),
            calendarEvents: [
                {
                    borrowedBySub: userSub1,
                    status: 'reserved',
                    dateStart: twoDaysFromToday.format('YYYY-MM-DD'),
                    dateEnd: sevenDaysFromToday.format('YYYY-MM-DD'),
                },
            ],
        };

        const newEvent: ICalendarEvent = {
            dateRange: {
                startDate: currentDay.format('YYYY-MM-DD'),
                endDate: calendar.calendarEvents[0].dateStart,
            },
            eventType: 'reserved',
        };

        const expectedResult = {
            updateSuccessful: false,
            errorMessage:
                'Prylen kan endast bokas under en sammanhängande period.',
            updatedCalendarResult: {
                ...calendar,
            },
        };

        const addDateRangeToEventsResult = addDateRangeToEvents(
            calendar,
            newEvent,
            userSub2,
        );

        expect(addDateRangeToEventsResult).toEqual(expectedResult);
    });
});

describe('Is date available', () => {
    it('current date between current date and tomorrow', () => {
        const result = isDateAvailable(moment(), {
            allowedDateStart: moment().format('YYYY-MM-DD'),
            allowedDateEnd: moment().add(1, 'days').format('YYYY-MM-DD'),
            calendarEvents: [],
        });

        expect(result).toBeTruthy();
    });

    it('all dates shall be available if allowed dates set to null', () => {
        const nullAllowedDateCalendar = {
            allowedDateStart: null,
            calendarEvents: [],
            allowedDateEnd: null,
        };

        const result = isDateAvailable(moment(), nullAllowedDateCalendar);

        expect(result).toBeTruthy();
    });

    it('current date (today) shall not be between tomorrow and the day after tomorrow', () => {
        const result = isDateAvailable(moment(), {
            allowedDateStart: moment().add(1, 'day').format('YYYY-MM-DD'),
            allowedDateEnd: moment().add(2, 'days').format('YYYY-MM-DD'),
            calendarEvents: [],
        });

        expect(result).toBeFalsy();
    });

    it('only dates before and after an event shall be enabled', () => {
        const calendarData = {
            allowedDateStart: moment().format('YYYY-MM-DD'),
            allowedDateEnd: moment().add(7, 'days').format('YYYY-MM-DD'),
            calendarEvents: [
                {
                    borrowedBySub: '11111-11111-11111-11111-11111',
                    status: 'reserved',
                    dateStart: moment().add(4, 'days').format('YYYY-MM-DD'),
                    dateEnd: moment().add(5, 'days').format('YYYY-MM-DD'),
                },
            ],
        };

        expect(isDateAvailable(moment(), calendarData)).toBeTruthy();
        expect(
            isDateAvailable(moment().add(4, 'days'), calendarData),
        ).toBeFalsy();
        expect(
            isDateAvailable(moment().add(6, 'days'), calendarData),
        ).toBeTruthy();
    });

    it('calendar without events', () => {
        const calendarData = {
            allowedDateStart: moment().format('YYYY-MM-DD'),
            allowedDateEnd: moment().add(7, 'days').format('YYYY-MM-DD'),
            calendarEvents: [],
        };

        expect(isDateAvailable(moment(), calendarData)).toBeTruthy();
        expect(
            isDateAvailable(moment().add(7, 'days'), calendarData),
        ).toBeTruthy();
    });

    it('event with status returned shall return dates available', () => {
        const returnDate = moment().add(5, 'days');

        const calendarWithReturnedEvent = {
            allowedDateStart: moment().format('YYYY-MM-DD'),
            allowedDateEnd: moment().add(7, 'days').format('YYYY-MM-DD'),
            calendarEvents: [
                {
                    borrowedBySub: '11111-11111-11111-11111-11111',
                    status: 'returned',
                    dateStart: moment().add(4, 'days').format('YYYY-MM-DD'),
                    dateEnd: returnDate.format('YYYY-MM-DD'),
                },
            ],
        };

        const dateAvailableResult = isDateAvailable(
            returnDate,
            calendarWithReturnedEvent,
        );

        expect(dateAvailableResult).toBeTruthy();
    });
});

describe('Update event status', () => {
    it('update event status to pickedUp', () => {
        const adCalendar = {
            allowedDateStart: '2022-02-02',
            calendarEvents: [
                {
                    borrowedBySub: '11111-11111-11111-11111-11111',
                    dateEnd: '2022-02-03',
                    dateStart: '2022-02-02',
                    status: 'reserved',
                },
                {
                    borrowedBySub: '22222-22222-22222-22222-22222',
                    dateEnd: '2022-02-05',
                    dateStart: '2022-02-04',
                    status: 'reserved',
                },
            ],
            allowedDateEnd: '2022-02-06',
        };
        const calendarEvent = {
            borrowedBySub: '22222-22222-22222-22222-22222',
            dateEnd: '2022-02-05',
            dateStart: '2022-02-04',
            status: 'reserved',
        };
        const newStatus = 'pickedUp';

        const expectedResult = {
            updateSuccessful: true,
            updatedCalendarResult: {
                allowedDateEnd: '2022-02-06',
                allowedDateStart: '2022-02-02',
                calendarEvents: [
                    {
                        borrowedBySub: '11111-11111-11111-11111-11111',
                        dateEnd: '2022-02-03',
                        dateStart: '2022-02-02',
                        status: 'reserved',
                    },
                    {
                        borrowedBySub: '22222-22222-22222-22222-22222',
                        dateEnd: '2022-02-05',
                        dateStart: '2022-02-04',
                        status: 'pickedUp',
                    },
                ],
            },
        };

        expect(updateEventStatus(adCalendar, calendarEvent, newStatus)).toEqual(
            expectedResult,
        );
    });

    it('update event status to returned', () => {
        const currentDateTime = moment().format('YYYY-MM-DD');
        const tomorrowDateTime = moment().add(1, 'day').format('YYYY-MM-DD');

        const adCalendar = {
            allowedDateStart: currentDateTime,
            calendarEvents: [
                {
                    borrowedBySub: '22222-22222-22222-22222-22222',
                    dateEnd: tomorrowDateTime,
                    dateStart: currentDateTime,
                    status: 'reserved',
                },
            ],
            allowedDateEnd: tomorrowDateTime,
        };
        const calendarEvent = {
            borrowedBySub: '22222-22222-22222-22222-22222',
            dateEnd: tomorrowDateTime,
            dateStart: currentDateTime,
            status: 'reserved',
        };
        const newStatus = 'returned';

        const updateEventStatusResult = updateEventStatus(
            adCalendar,
            calendarEvent,
            newStatus,
        );
        const { returnDateTime, status } =
            updateEventStatusResult.updatedCalendarResult.calendarEvents[0];

        expect(updateEventStatusResult.updatedCalendarResult).toBeTruthy();
        expect(status).toMatch('returned');
        expect(moment(returnDateTime).diff(moment())).toBeLessThan(500);
    });

    it('events with status returned shall not be possible to change', () => {
        const adCalendar = {
            allowedDateStart: '2022-02-08',
            calendarEvents: [
                {
                    borrowedBySub: '1',
                    dateEnd: '2022-02-10',
                    dateStart: '2022-02-08',
                    status: 'returned',
                    returnDateTime: '2022-10-10T09:58:48.881Z',
                },
            ],
            allowedDateEnd: '2022-02-28',
        };

        const calendarEvent = {
            borrowedBySub: '1',
            dateEnd: '2022-02-10',
            dateStart: '2022-02-08',
            status: 'reserved',
        };
        const newStatus = 'pickedUp';

        const expectedResult = {
            updateSuccessful: false,
            updatedCalendarResult: {
                allowedDateStart: '2022-02-08',
                calendarEvents: [
                    {
                        borrowedBySub: '1',
                        dateEnd: '2022-02-10',
                        dateStart: '2022-02-08',
                        status: 'returned',
                        returnDateTime: '2022-10-10T09:58:48.881Z',
                    },
                ],
                allowedDateEnd: '2022-02-28',
            },
        };

        expect(updateEventStatus(adCalendar, calendarEvent, newStatus)).toEqual(
            expectedResult,
        );
    });

    it('only change status for reserved event', () => {
        const adCalendar = {
            allowedDateStart: '2022-02-08',
            calendarEvents: [
                {
                    borrowedBySub: '1',
                    dateEnd: '2022-02-10',
                    dateStart: '2022-02-08',
                    status: 'returned',
                    returnDateTime: '2022-10-10T09:58:48.881Z',
                },
                {
                    borrowedBySub: '1',
                    dateEnd: '2022-02-10',
                    dateStart: '2022-02-08',
                    status: 'reserved',
                },
            ],
            allowedDateEnd: '2022-02-28',
        };

        const calendarEvent = {
            borrowedBySub: '1',
            dateEnd: '2022-02-10',
            dateStart: '2022-02-08',
            status: 'reserved',
        };
        const newStatus = 'pickedUp';

        const expectedResult = {
            updateSuccessful: true,
            updatedCalendarResult: {
                allowedDateStart: '2022-02-08',
                calendarEvents: [
                    {
                        borrowedBySub: '1',
                        dateEnd: '2022-02-10',
                        dateStart: '2022-02-08',
                        status: 'returned',
                        returnDateTime: '2022-10-10T09:58:48.881Z',
                    },
                    {
                        borrowedBySub: '1',
                        dateEnd: '2022-02-10',
                        dateStart: '2022-02-08',
                        status: 'pickedUp',
                    },
                ],
                allowedDateEnd: '2022-02-28',
            },
        };

        expect(updateEventStatus(adCalendar, calendarEvent, newStatus)).toEqual(
            expectedResult,
        );
    });
});

describe('Get last event', () => {
    it('get last event of multiple returned', () => {
        const adCalendar = {
            allowedDateStart: '2022-02-02',
            allowedDateEnd: '2022-02-06',
            calendarEvents: [
                {
                    borrowedBySub: '22222-22222-22222-22222-22222',
                    dateEnd: '2022-02-04',
                    dateStart: '2022-02-05',
                    status: 'returned',
                    returnDateTime: '2022-05-17T09:58:48.881Z',
                },
                {
                    borrowedBySub: '11111-11111-11111-11111-11111',
                    dateEnd: '2022-02-03',
                    dateStart: '2022-02-02',
                    status: 'returned',
                    returnDateTime: '2022-03-17T09:58:48.881Z',
                },
                {
                    borrowedBySub: '11111-11111-11111-11111-11111',
                    dateEnd: '2022-02-03',
                    dateStart: '2022-02-04',
                    status: 'returned',
                    returnDateTime: '2022-04-10T09:58:48.881Z',
                },
            ],
        };

        const expectedResult = {
            borrowedBySub: '22222-22222-22222-22222-22222',
            dateEnd: '2022-02-04',
            dateStart: '2022-02-05',
            status: 'returned',
            returnDateTime: '2022-05-17T09:58:48.881Z',
        };

        expect(getLastReturnedCalendarEvent(adCalendar)).toEqual(
            expectedResult,
        );
    });

    it('return last event with a returned date time', () => {
        const adCalendar = {
            allowedDateStart: '2022-02-02',
            allowedDateEnd: '2022-02-06',
            calendarEvents: [
                {
                    borrowedBySub: '22222-22222-22222-22222-22222',
                    dateEnd: '2022-02-04',
                    dateStart: '2022-02-05',
                    status: 'returned',
                    returnDateTime: '2022-05-17T09:58:48.881Z',
                },
                {
                    borrowedBySub: '11111-11111-11111-11111-11111',
                    dateEnd: '2022-12-01',
                    dateStart: '2022-12-02',
                    status: 'reserved',
                },
                {
                    borrowedBySub: '11111-11111-11111-11111-11111',
                    dateEnd: '2022-02-03',
                    dateStart: '2022-02-04',
                    status: 'returned',
                    returnDateTime: '2022-04-10T09:58:48.881Z',
                },
            ],
        };

        const expectedResult = {
            borrowedBySub: '22222-22222-22222-22222-22222',
            dateEnd: '2022-02-04',
            dateStart: '2022-02-05',
            status: 'returned',
            returnDateTime: '2022-05-17T09:58:48.881Z',
        };

        expect(getLastReturnedCalendarEvent(adCalendar)).toEqual(
            expectedResult,
        );
    });

    it('return undefined if no object found with returned date time', () => {
        const adCalendar = {
            allowedDateStart: '2022-02-02',
            allowedDateEnd: '2022-02-06',
            calendarEvents: [
                {
                    borrowedBySub: '22222-22222-22222-22222-22222',
                    dateEnd: '2022-02-04',
                    dateStart: '2022-02-05',
                    status: 'reserved',
                },
                {
                    borrowedBySub: '11111-11111-11111-11111-11111',
                    dateEnd: '2022-12-01',
                    dateStart: '2022-12-02',
                    status: 'reserved',
                },
                {
                    borrowedBySub: '11111-11111-11111-11111-11111',
                    dateEnd: '2022-02-03',
                    dateStart: '2022-02-04',
                    status: 'reserved',
                },
            ],
        };

        expect(getLastReturnedCalendarEvent(adCalendar)).toBeUndefined();
    });

    it('return undefined if empty', () => {
        const adCalendar = {
            allowedDateStart: '2022-02-21',
            allowedDateEnd: '2022-02-28',
            calendarEvents: [],
        };

        expect(getLastReturnedCalendarEvent(adCalendar)).toBeUndefined();
    });

    it('one event', () => {
        const adCalendar = {
            allowedDateStart: '2022-02-21',
            calendarEvents: [
                {
                    borrowedBySub: '8409a340-a3a8-4aff-a6c4-55ae026d16a8',
                    dateEnd: '2022-02-22',
                    dateStart: '2022-02-21',
                    status: 'reserved',
                },
            ],
            allowedDateEnd: '2022-02-28',
        };

        expect(getLastReturnedCalendarEvent(adCalendar)).toBeUndefined();
    });
});
