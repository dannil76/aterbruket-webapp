import { AdvertStatus, BorrowStatus, AdvertType, QuantityUnit } from './enums';

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
  quantity: number;
}

export interface AdvertBorrowCalendar {
  allowedDateEnd: Date;
  allowedDateStart: Date;
  calendarEvents: AdvertBorrowCalendarEvent[];
}

export interface AdvertPickUp {
  reservedBySub: string;
  quantity: number;
  reservationDate: Date;
  pickedUp: boolean | undefined | null;
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
  advertBorrowCalendar: AdvertBorrowCalendar | undefined;
  advertPickUps: AdvertPickUp[];
  version: number;
  status: AdvertStatus;
  updatedAt: Date;
  quantity: number;
  quantityUnit: QuantityUnit;
}
