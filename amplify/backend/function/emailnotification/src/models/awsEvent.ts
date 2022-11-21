import {
    AdvertStatus,
    BorrowStatus,
    EventType,
    AdvertType,
    QuantityUnit,
} from './enums';

export interface NumberRecord {
    N: string;
}

export interface StringRecord {
    S: string | undefined;
}

export interface DateRecord {
    S: string | undefined;
}

export interface EnumRecord<T> {
    S: T;
}

export interface ModifiedRecord<T> {
    M: T;
}

export interface ModelRecord<T> {
    M: T;
}

export interface BooleanRecord {
    B: boolean | undefined;
}

export interface ListRecord<T> {
    L: T[];
}

export interface KeysRecord {
    Id: NumberRecord;
}

export interface MissingAccessory {
    reportedBy: StringRecord;
    reportedDate: DateRecord;
    accessories: ListRecord<StringRecord>;
    lastReturnedBy: StringRecord;
    M: MissingAccessory;
}

export interface AdvertBorrowCalendarEvent {
    borrowedBySub: StringRecord;
    dateEnd: DateRecord;
    dateStart: DateRecord;
    returnDateTime: DateRecord;
    status: EnumRecord<BorrowStatus>;
    quantity: NumberRecord;
}

export interface AdvertBorrowCalendar {
    allowedDateEnd: DateRecord | null;
    allowedDateStart: DateRecord | null;
    calendarEvents: ListRecord<ModelRecord<AdvertBorrowCalendarEvent>>;
}

export interface AdvertPickUp {
    reservedBySub: StringRecord;
    quantity: NumberRecord;
    reservationDate: StringRecord;
    pickedUp: BooleanRecord | undefined | null;
}

export interface Advert {
    id: StringRecord;
    title: StringRecord;
    advertType: EnumRecord<AdvertType>;
    status: EnumRecord<AdvertStatus>;
    contactPerson: StringRecord;
    department: StringRecord;
    address: StringRecord;
    postalCode: StringRecord;
    email: StringRecord;
    phoneNumber: StringRecord;
    city: StringRecord;
    missingAccessories: ListRecord<ModelRecord<MissingAccessory>>;
    advertBorrowCalendar: ModelRecord<AdvertBorrowCalendar>;
    advertPickUps: ModelRecord<AdvertPickUp[]>;
    reservedBySub: StringRecord;
    version: NumberRecord;
    updatedAt: DateRecord;
    quantity: NumberRecord;
    quantityUnit: EnumRecord<QuantityUnit>;
}

export interface DynamoDBEvent {
    Keys: KeysRecord;
    NewImage: Advert | undefined;
    OldImage: Advert | undefined;
    SequenceNumber: string;
    SizeBytes: number;
    StreamViewType: string;
}

export interface EventRecord {
    eventID: string;
    eventName: EventType;
    eventVersion: string;
    eventSource: string;
    awsRegion: string;
    dynamodb: DynamoDBEvent;
    eventSourceARN: string;
}

export interface Event {
    Records: EventRecord[];
}
