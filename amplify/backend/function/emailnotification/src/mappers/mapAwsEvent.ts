import {
    QuantityUnit,
    Advert,
    AdvertBorrowCalendar,
    AdvertBorrowCalendarEvent,
    AdvertPickUp,
} from '../models';
import {
    Advert as AwsAdvert,
    MissingAccessory,
    ModelRecord,
    StringRecord,
} from '../models/awsEvent';
import {
    getBoolean,
    getDate,
    getEnum,
    getList,
    getModel,
    getNumber,
    getString,
} from './awsEventUtilities';
import { logDebug } from '../utils';

export default function mapAwsEvent(
    event: AwsAdvert | undefined,
): Advert | undefined {
    if (!event) {
        return undefined;
    }

    const id = getString(event.id, 'id');
    logDebug(`Try to map event ${id}`);

    let missingAccessories = [];
    if (event.missingAccessories) {
        const models = getList<ModelRecord<MissingAccessory>>(
            event.missingAccessories,
            'missingAccessories',
        );
        missingAccessories = models.map((model) => {
            const missing = getModel(model, 'missingAccessory');

            return {
                accessories: getList<StringRecord>(missing.accessories).map(
                    (accessory) => getString(accessory, 'accessory'),
                ),
                lastReturnedBy: getString(
                    missing.lastReturnedBy,
                    'lastReturnedBy',
                ),
                reportedBy: getString(missing.reportedBy, 'reportedBy'),
                reportedDate: getDate(missing.reportedDate, 'reportedDate'),
            };
        });
    }

    let advertPickUps = [];
    if (event.advertPickUps) {
        const pickUps = getList(event.advertPickUps, 'advertPickUpList');
        advertPickUps = pickUps
            .map((pickUp) => {
                return getModel(pickUp, 'advertPickup');
            })
            .map((pickUp) => {
                return {
                    pickedUp: getBoolean(pickUp.pickedUp, 'pickedUp'),
                    quantity: getNumber(pickUp.quantity, 'pickUpQuantity'),
                    reservationDate: getDate(
                        pickUp.reservationDate,
                        'pickUpReservationDate',
                    ),
                    reservedBySub: getString(
                        pickUp.reservedBySub,
                        'pickUpReservedBySub',
                    ),
                } as AdvertPickUp;
            });
    }

    let advertBorrowCalendar = undefined as AdvertBorrowCalendar;
    if (event.advertBorrowCalendar) {
        const calendar = getModel(
            event.advertBorrowCalendar,
            'advertBorrowCalendar',
        );

        advertBorrowCalendar = {
            allowedDateStart: getDate(
                calendar.allowedDateStart,
                'allowedDateStart',
                new Date(0),
            ),
            allowedDateEnd: getDate(
                calendar.allowedDateEnd,
                'allowedDateEnd',
                ((d) => new Date(d.getFullYear() + 10))(new Date()),
            ),
            calendarEvents: getList(
                calendar.calendarEvents,
                'calendarEvents',
            ).map((calendarEventModel) => {
                const calendarEvent = getModel(
                    calendarEventModel,
                    'calendarEventModel',
                );
                const borrowedBySub = getString(
                    calendarEvent.borrowedBySub,
                    'borrowedBySub',
                );
                const dateStart = getDate(calendarEvent.dateStart, 'dateStart');
                const dateEnd = getDate(calendarEvent.dateEnd, 'dateStart');
                const returnDateTime = calendarEvent.returnDateTime
                    ? getDate(calendarEvent.returnDateTime, 'returnDateTime')
                    : null;
                const quantity = getNumber(
                    calendarEvent.quantity,
                    'eventQuantity',
                );
                const status = getEnum(calendarEvent.status, 'borrowStatus');

                return {
                    borrowedBySub,
                    dateStart,
                    dateEnd,
                    returnDateTime,
                    status,
                    quantity,
                } as AdvertBorrowCalendarEvent;
            }),
        };
    }

    return {
        id,
        address: getString(event.address, 'address'),
        advertType: getEnum(event.advertType, 'advertType'),
        city: getString(event.city, 'city'),
        contactPerson: getString(event.contactPerson, 'contactPerson'),
        department: getString(event.department, 'department'),
        email: getString(event.email, 'email'),
        phoneNumber: getString(event.phoneNumber, 'phoneNumber'),
        postalCode: getString(event.postalCode, 'postalCode'),
        reservedBySub: event.reservedBySub
            ? getString(event.reservedBySub, 'reservedBySub')
            : undefined,
        title: getString(event.title, 'title'),
        version: getNumber(event.version, 'version'),
        status: getEnum(event.status, 'status'),
        updatedAt: getDate(event.updatedAt, 'updatedAt'),
        missingAccessories,
        advertBorrowCalendar,
        advertPickUps,
        quantity: getNumber(event.quantity, 'quantity'),
        quantityUnit:
            getEnum(event.quantityUnit, 'quantityUnit') ?? QuantityUnit.st,
    } as Advert;
}
