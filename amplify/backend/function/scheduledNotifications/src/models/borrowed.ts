export enum BorrowedStatus {
    PICKEDUP = 'pickedUp',
    RETURNED = 'returned',
    RESERVED = 'reserved',
}

export interface BorrowCalendarEvent {
    borrowedBySub: string;
    dateEnd: string;
    dateStart: string;
    status: BorrowedStatus;
}

export interface BorrowCalendar {
    allowedDateEnd: string;
    allowedDateStart: string;
    calendarEvents: BorrowCalendarEvent[];
}

export interface Borrowed {
    id: string;
    version: number;
    advertBorrowCalendar: BorrowCalendar;
    title: string;
    contactPerson: string;
    department: string;
    email: string;
    phone: string;
}
