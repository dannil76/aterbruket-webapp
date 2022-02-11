import { User } from './../contexts/UserContext';
import { isMobile } from "react-device-detect";
import { IAdvert, IReservation } from "../interfaces/IAdvert";
import { administrations } from "../static/advertMeta";
import { AdministrationInput } from "../API";

export const getActiveReservation = (
  item: IAdvert,
  userSub: string
): IReservation | null => {
  const allReservations = item?.advertBorrowCalendar?.calendarEvents
    ? item.advertBorrowCalendar.calendarEvents
    : [];

  const userReservations = allReservations?.filter(
    (reservation: IReservation) => {
      return reservation.borrowedBySub === userSub;
    }
  );

  if (userReservations?.length === 0) {
    return null;
  }

  const mostRecentReservation = userReservations?.reduce(
    (prev: IReservation, current: IReservation) => {
      return prev.dateStart > current.dateStart ? prev : current;
    }
  );

  if (mostRecentReservation.status === "returned") {
    return null;
  }

  return mostRecentReservation;
};

export const hasUserBorrowPermission = (user: User, advert: IAdvert) => {
  if (advert.accessRestriction !== "selection") {
    return true
  }

  const userDepartmentKey = administrations.find(
    (administration) => administration.title === user.company
  )?.key;

  if (!userDepartmentKey) {
    return false;
  }

  return advert?.accessRestrictionSelection?.[userDepartmentKey as keyof AdministrationInput];
}

export const getStatus = (
  item: IAdvert,
  user: User,
  date: Date
): string => {
  if (item.advertType === "recycle") {
    return item.status;
  }

  const statuses = {
    available: "available",
    reserved: "reserved",
    pickedUp: "pickedUp",
    pickUpAllowed: "pickUpAllowed",
    returned: "returned",
    borrowPermissionDenied: "borrowPermissionDenied"
  };

  if(!hasUserBorrowPermission(user, item)) {
    return statuses.borrowPermissionDenied;
  }

  const allReservations = item?.advertBorrowCalendar?.calendarEvents
    ? item.advertBorrowCalendar.calendarEvents
    : [];

  const userReservations = allReservations?.filter(
    (reservation: IReservation) => {
      return reservation.borrowedBySub === user.sub;
    }
  );

  if (userReservations?.length === 0) {
    return statuses.available;
  }

  const mostRecentReservation = userReservations?.reduce(
    (prev: IReservation, current: IReservation) => {
      return prev.dateStart > current.dateStart ? prev : current;
    }
  );

  if (mostRecentReservation?.status === statuses.reserved) {
    if (
      date >= new Date(mostRecentReservation.dateStart) &&
      date <= new Date(mostRecentReservation.dateEnd)
    ) {
      return statuses.pickUpAllowed;
    }

    return statuses.reserved;
  }

  if (mostRecentReservation?.status === statuses.pickedUp) {
    return statuses.pickedUp;
  }

  return statuses.available;
};

export const convertToSwedishDate = (date: string): string => {
  const dateObject = new Date(date);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return dateObject.toLocaleDateString("sv-SW", options);
};

export const launchNavigation = (location: string): void => {
  if (isMobile) {
    window.open(`geo:0,0?q=${location}`);
  }
  window.open(
    `https://www.google.com/maps/dir/?api=1&travelmode=transit&layer=traffic&destination=${location}`
  );
};
