import { getStatus, getActiveReservation } from "./advertHelper";
import BorrowAdvert from "../mocks/BorrowAdvert.json";
import RecycleAdvert from "../mocks/RecycleAdvert.json";

const user1 = "0b293fb6-3cad-42a4-a476-9e115406f415";
const user2 = "0b293fb6-3cad-42a4-a476-9e115406f411";
const user3 = "0b293fb6-3cad-42a4-a476-9e115406f412";
const user4 = "0b293fb6-3cad-42a4-a476-9e115406f419";

const reservations = [
  {
    borrowedBySub: user1,
    status: "returned",
    dateStart: "2022-01-03",
    dateEnd: "2022-01-04",
  },
  {
    borrowedBySub: user2,
    status: "returned",
    dateStart: "2022-01-03",
    dateEnd: "2022-01-04",
  },
  {
    borrowedBySub: user2,
    status: "reserved",
    dateStart: "2022-01-05",
    dateEnd: "2022-01-06",
  },
  {
    borrowedBySub: user3,
    status: "pickedUp",
    dateStart: "2022-01-20",
    dateEnd: "2022-02-10",
  },
  {
    borrowedBySub: user4,
    status: "reserved",
    dateStart: "2022-02-01",
    dateEnd: "2022-02-10",
  },
];

const borrowAdvert = BorrowAdvert;
borrowAdvert.advertBorrowCalendar.calendarEvents = reservations;

const date = new Date("2022-02-01");

describe("Get status", () => {
  test("Recycle advert returns available", () =>
    expect(getStatus(RecycleAdvert, user1, date)).toBe("available"));

  test("Borrow advert returns available", () =>
    expect(getStatus(borrowAdvert, user1, date)).toBe("available"));

  test("Borrow advert returns reserved", () =>
    expect(getStatus(borrowAdvert, user2, date)).toBe("reserved"));

  test("Borrow advert returns pickUpAllowed", () =>
    expect(getStatus(borrowAdvert, user4, date)).toBe("pickUpAllowed"));

  test("Borrow advert returns pickedUp", () =>
    expect(getStatus(borrowAdvert, user3, date)).toBe("pickedUp"));
});

describe("Get active reservation", () => {
  test("Return latest reservation", () =>
    expect(getActiveReservation(borrowAdvert, user2)).toMatchObject(
      reservations[2]
    ));

  test("Recycle advert returns available", () =>
    expect(getActiveReservation(borrowAdvert, user1)).toBeNull());
});
