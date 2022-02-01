import { isMobile } from "react-device-detect";
import { IAdvert } from "../interfaces/IAdvert";

interface IReservation {
  borrowedBySub: string;
  status: string;
  borrowedDateRange: {
    dateStart: string;
    dateEnd: string;
  };
}

// TODO: remove mock
const reservationsMock = [
  {
    borrowedBySub: "0b293fb6-3cad-42a4-a476-9e115406f415",
    status: "returned",
    borrowedDateRange: {
      dateStart: "2022-01-3",
      dateEnd: "2022-01-04",
    },
  },
  {
    borrowedBySub: "0b293fb6-3cad-42a4-a476-9e115406f415",
    status: "reserved",
    borrowedDateRange: {
      dateStart: "2022-01-20",
      dateEnd: "2022-02-10",
    },
  },
];

export const getActiveReservation = (
  // reservations: IReservation[],
  userSub: string
) => {
  // TODO: add functionality
  return reservationsMock[1];
};

export const getStatus = (item: IAdvert, userSub: string): string => {
  if (item.advertType === "recycle") {
    return item.status;
  }

  // TODO: add functionality
  const statuses = ["available", "reserved", "pickUpAllowed", "pickedUp"];
  return statuses[0];
};

export const convertToSwedishDate = (date: string) => {
  const dateObject = new Date(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return dateObject.toLocaleDateString("sv-SW", options);
};

export const launchNavigation = (location: string) => {
  if (isMobile) {
    window.open(`geo:0,0?q=${location}`);
  }
  window.open(
    `https://www.google.com/maps/dir/?api=1&travelmode=transit&layer=traffic&destination=${location}`
  );
};
