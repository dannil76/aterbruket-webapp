import { AdvertType } from './advertType';

export interface MissingAccessory {
    reportedBy: string;
    reportedDate: Date;
    accessories: string[];
    lastReturnedBy: string;
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
    reservedBySub: string;
    version: number;
}
