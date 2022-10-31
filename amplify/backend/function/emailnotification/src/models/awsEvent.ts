import { AdvertType } from './advertType';

export enum EventType {
    MODIFY = 'MODIFY',
    INSERT = 'INSERT',
    DELETE = 'DELETE',
    REMOVE = 'REMOVE',
}

export interface NumberRecord {
    N: string;
}

export interface StringRecord {
    S: string;
}

export interface DateRecord {
    S: string;
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

export interface Advert {
    id: StringRecord;
    title: StringRecord;
    advertType: EnumRecord<AdvertType>;
    contactPerson: StringRecord;
    department: StringRecord;
    address: StringRecord;
    postalCode: StringRecord;
    email: StringRecord;
    phoneNumber: StringRecord;
    city: StringRecord;
    missingAccessories: ListRecord<ModelRecord<MissingAccessory>>;
    reservedBySub: StringRecord;
    version: NumberRecord;
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
