import { AdvertBorrowCalendarEvent } from '../models/haffaAdvert';

export default function getAdvertCalendarChange(
  previous: AdvertBorrowCalendarEvent[],
  current: AdvertBorrowCalendarEvent[],
): AdvertBorrowCalendarEvent | undefined {
  let result = undefined as AdvertBorrowCalendarEvent;
  if (previous.length === 0) {
    return current[0];
  }

  current.forEach((event) => {
    const exist = previous.some((previousEvent) => {
      const { borrowedBySub, dateEnd, dateStart, returnDateTime, status } =
        previousEvent;

      if (
        event.borrowedBySub !== borrowedBySub ||
        event.dateEnd.getTime() !== dateEnd.getTime() ||
        event.dateStart.getTime() !== dateStart.getTime()
      ) {
        return false;
      }

      if (event.status !== status) {
        return false;
      }

      if (!event.returnDateTime && !returnDateTime) {
        return true;
      }

      if (!event.returnDateTime !== !returnDateTime) {
        return false;
      }

      return event.returnDateTime.getTime() === returnDateTime.getTime();
    });

    if (!exist) {
      result = event;
    }
  });

  return result;
}
