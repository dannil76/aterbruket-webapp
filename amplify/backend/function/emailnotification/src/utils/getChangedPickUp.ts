import { AdvertPickUp } from 'models/haffaAdvert';

export default function getChangedPickUp(
  previousPickUps: AdvertPickUp[] | undefined | null,
  newPickUps: AdvertPickUp[] | undefined | null,
): AdvertPickUp | undefined {
  if (!newPickUps || newPickUps.length === 0) {
    return undefined;
  }

  if (!previousPickUps || previousPickUps.length === 0) {
    return newPickUps[newPickUps.length - 1];
  }

  return newPickUps.find((pickUp) => {
    return previousPickUps.every(
      (previous) =>
        pickUp.pickedUp !== previous.pickedUp &&
        pickUp.quantity !== previous.quantity &&
        pickUp.reservationDate !== previous.reservationDate &&
        pickUp.reservedBySub !== previous.reservedBySub,
    );
  });
}
