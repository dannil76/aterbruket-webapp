import { isMobile } from 'react-device-detect';
import { User } from '../contexts/UserContext';
import { administrations } from '../static/advertMeta';
import {
    AdministrationInput,
    Advert,
    BorrowStatus,
    CalendarEvent,
    ItemAdvertType,
    ItemStatus,
} from '../graphql/models';

export const getActiveReservation = (
    item: Advert | undefined,
    userSub: string,
): CalendarEvent | null => {
    if (!item) {
        return null;
    }

    const allReservations = item?.advertBorrowCalendar?.calendarEvents
        ? item.advertBorrowCalendar.calendarEvents
        : [];

    const userReservations = allReservations?.filter((reservation) => {
        return (
            reservation.borrowedBySub === userSub &&
            reservation.status !== BorrowStatus.cancelled &&
            reservation.status !== BorrowStatus.returned
        );
    });

    if (userReservations?.length === 0) {
        return null;
    }

    const mostRecentReservation = userReservations?.reduce((prev, current) => {
        const prevDateStart = new Date(prev.dateStart ?? 0);
        const currDateStart = new Date(current.dateStart ?? 0);
        return prevDateStart > currDateStart ? prev : current;
    });

    if (mostRecentReservation.status === 'returned') {
        return null;
    }

    return mostRecentReservation;
};

export const hasUserBorrowPermission = (user: User, advert: Advert) => {
    if (advert.accessRestriction !== 'selection') {
        return true;
    }

    const userDepartmentKey = administrations.find(
        (administration) => administration.title === user.company,
    )?.key;

    if (!userDepartmentKey) {
        return false;
    }

    return advert?.accessRestrictionSelection?.[
        userDepartmentKey as keyof AdministrationInput
    ];
};

export const getStatus = (
    item: Advert | undefined,
    user: User,
    date: Date,
): string => {
    if (!item) {
        return 'Retrieved undefined item';
    }

    if (item.advertType === ItemAdvertType.recycle) {
        const reserved = item.advertPickUps?.some((pickUp) => {
            return pickUp.reservedBySub === user.sub && !pickUp.pickedUp;
        });

        if (reserved) {
            return ItemStatus.reserved;
        }

        const pickedUp = item.advertPickUps?.some((pickUp) => {
            return pickUp.reservedBySub === user.sub && pickUp.pickedUp;
        });

        const quantityTaken =
            item.advertPickUps?.reduce(
                (partial, pickUp) => partial + pickUp.quantity,
                0,
            ) ?? 0;

        // If everything is taken
        if (pickedUp && (item.quantity ?? 1) <= quantityTaken) {
            return ItemStatus.pickedUp;
        }

        // If there is still some items left
        return ItemStatus.available;
    }

    const statuses = {
        available: 'available',
        reserved: 'reserved',
        pickedUp: 'pickedUp',
        pickUpAllowed: 'pickUpAllowed',
        returned: 'returned',
        borrowPermissionDenied: 'borrowPermissionDenied',
    };

    if (!hasUserBorrowPermission(user, item)) {
        return statuses.borrowPermissionDenied;
    }

    const allReservations = item?.advertBorrowCalendar?.calendarEvents
        ? item.advertBorrowCalendar.calendarEvents
        : [];

    const userReservations = allReservations?.filter((reservation) => {
        return (
            reservation.borrowedBySub === user.sub &&
            reservation.status !== BorrowStatus.cancelled &&
            reservation.status !== BorrowStatus.returned
        );
    });

    if (userReservations?.length === 0) {
        return statuses.available;
    }

    const mostRecentReservation = userReservations?.reduce((prev, current) => {
        return new Date(prev.dateStart ?? 0).getTime() >
            new Date(current.dateStart ?? 0).getTime()
            ? prev
            : current;
    });

    if (mostRecentReservation?.status === statuses.reserved) {
        if (
            date >= new Date(mostRecentReservation.dateStart ?? 0) &&
            date <= new Date(mostRecentReservation.dateEnd ?? '2100-01-01')
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
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    } as Intl.DateTimeFormatOptions;
    return dateObject.toLocaleDateString('sv-SW', options);
};

export const launchNavigation = (location: string): void => {
    if (isMobile) {
        window.open(`geo:0,0?q=${location}`);
    }
    window.open(
        `https://www.google.com/maps/dir/?api=1&travelmode=transit&layer=traffic&destination=${location}`,
    );
};
