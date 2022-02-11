import { IAdvert } from './../interfaces/IAdvert';
import { getStatus, getActiveReservation, hasUserBorrowPermission } from "./advertHelper";
import BorrowAdvert from "../mocks/BorrowAdvert.json";
import RecycleAdvert from "../mocks/RecycleAdvert.json";

const user1 = {
  "sub": "0b293fb6-3cad-42a4-a476-9e115406f415",
  "email": "foo.bar@helsingborg.se",
  "department": "Foobardepartment",
  "company": "Stadsledningsförvaltningen",
  "address": "Test 1",
  "postalCode": "12345",
  "isAdmin": true
};
const user2 = {...user1, sub: "0b293fb6-3cad-42a4-a476-9e115406f411", company: "Foobar"};
const user3 = {...user1, sub: "0b293fb6-3cad-42a4-a476-9e115406f412"};
const user4 = {...user1, sub: "0b293fb6-3cad-42a4-a476-9e115406f419"};
const user5 = { ...user1, sub: "0b293fb6-3cad-42a4-a476-9e115406f400", company: "Foobar"};

const reservations = [
  {
    borrowedBySub: user1.sub,
    status: "returned",
    dateStart: "2022-01-03",
    dateEnd: "2022-01-04",
  },
  {
    borrowedBySub: user2.sub,
    status: "returned",
    dateStart: "2022-01-03",
    dateEnd: "2022-01-04",
  },
  {
    borrowedBySub: user2.sub,
    status: "reserved",
    dateStart: "2022-01-05",
    dateEnd: "2022-01-06",
  },
  {
    borrowedBySub: user3.sub,
    status: "pickedUp",
    dateStart: "2022-01-20",
    dateEnd: "2022-02-10",
  },
  {
    borrowedBySub: user4.sub,
    status: "reserved",
    dateStart: "2022-02-01",
    dateEnd: "2022-02-10",
  },
];

const borrowAdvert = <IAdvert>{
    ...BorrowAdvert,
    advertBorrowCalendar: {
      allowedDateEnd: "2022-01-01",
      allowedDateStart: "2030-01-01",
      calendarEvents: reservations
    }
};

const date = new Date("2022-02-01");

describe("Get status", () => {
  test("Recycle advert returns available", () =>
    expect(getStatus(RecycleAdvert as IAdvert, user1, date)).toBe("available"));

  test("Borrow advert returns available", () =>
    expect(getStatus(borrowAdvert, user1, date)).toBe("available"));

  test("Borrow advert returns reserved", () =>
    expect(getStatus(borrowAdvert, user2, date)).toBe("reserved"));

  test("Borrow advert returns pickUpAllowed", () =>
    expect(getStatus(borrowAdvert, user4, date)).toBe("pickUpAllowed"));

  test("Borrow advert returns pickedUp", () =>
    expect(getStatus(borrowAdvert, user3, date)).toBe("pickedUp"));

  const borrowAdvert1 = {
    ...BorrowAdvert,
    accessRestriction: "selection",
    accessRestrictionSelection: {"arbetsmarknadsforvaltningen": true},
  };
  test("Borrow advert returns borrowPermissionDenied", () =>
    expect(getStatus(borrowAdvert1, user5, date)).toBe("borrowPermissionDenied"));
});

describe("Get active reservation", () => {
  test("Return latest reservation", () =>
    expect(getActiveReservation(borrowAdvert, user2.sub)).toMatchObject(
      reservations[2]
    ));

  test("Recycle advert returns available", () =>
    expect(getActiveReservation(borrowAdvert, user1.sub)).toBeNull());
});


describe("Checks if user has permission to borrow advert",  () => {
  test("Returns true if advert has no restrictions", () =>
    expect(hasUserBorrowPermission(user1, BorrowAdvert as IAdvert)).toBeTruthy());

  const borrowAdvert1 = {
    ...BorrowAdvert,
    accessRestriction: "selection",
    accessRestrictionSelection: {"kulturforvaltningen": true}
  };
  test("Returns false if user don't have permission", () =>
    expect(hasUserBorrowPermission(user2, borrowAdvert1)).toBeFalsy());
  const borrowAdvert2 = {
    ...BorrowAdvert,
    accessRestriction: "selection",
    accessRestrictionSelection: {"stadsledningsforvaltningen": true}
  };
  test("Returns true if user has permission", () =>
    expect(hasUserBorrowPermission(user3, borrowAdvert2)).toBeTruthy());
});
