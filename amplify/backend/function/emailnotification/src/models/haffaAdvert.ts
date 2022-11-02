import { AdvertStatus, BorrowStatus, AdvertType } from './enums';

export interface MissingAccessory {
    reportedBy: string;
    reportedDate: Date;
    accessories: string[];
    lastReturnedBy: string;
}

export interface AdvertBorrowCalendarEvent {
    borrowedBySub: string;
    dateEnd: Date;
    dateStart: Date;
    returnDateTime: Date | null;
    status: BorrowStatus;
}

export interface AdvertBorrowCalendar {
    allowedDateEnd: Date;
    allowedDateStart: Date;
    calendarEvents: AdvertBorrowCalendarEvent[];
}

export interface Advert {
    id: string;
    title: string;
    advertType: AdvertType;
    contactPerson: string;
    department: string;
    address: string;
    postalCode: string;
    email: string;
    phoneNumber: string;
    city: string;
    missingAccessories: MissingAccessory[];
    reservedBySub: string | undefined;
    advertBorrowCalendar: AdvertBorrowCalendar | undefined;
    version: number;
    status: AdvertStatus;
    updatedAt: Date;
}
