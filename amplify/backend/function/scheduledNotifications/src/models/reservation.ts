export interface Reservation {
    id: string;
    version: number;
    reservedBySub: string;
    contactPerson: string;
    title: string;
    department: string;
    email: string;
    phoneNumber: string;
}
