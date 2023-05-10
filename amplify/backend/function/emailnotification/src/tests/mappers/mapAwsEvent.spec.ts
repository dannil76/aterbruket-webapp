import { Advert as AwsAdvert } from '../../models/awsEvent';
import { mapAwsEvent } from '../../mappers';
import { Advert } from '../../models';

describe('map aws event', () => {
  describe('missing accessories', () => {
    const event = {
      missingAccessories: {
        L: [
          {
            M: {
              reportedDate: { S: '2022-01-01' },
              lastReturnedBy: { S: 'abc' },
              reportedBy: { S: 'def' },
              accessories: {
                L: [{ S: 'kattborste' }, { S: 'laserpekare' }],
              },
            },
          },
        ],
      },
    } as unknown as AwsAdvert;

    it('should map correctly', () => {
      const actual = mapAwsEvent(event) as Advert | undefined;
      expect(actual).not.toBeUndefined();
      expect(actual?.missingAccessories[0].reportedBy).toBe('def');
      expect(actual?.missingAccessories[0].lastReturnedBy).toBe('abc');
      expect(actual?.missingAccessories[0].accessories).toStrictEqual([
        'kattborste',
        'laserpekare',
      ]);
      expect(actual?.missingAccessories[0].reportedDate.toDateString()).toBe(
        'Sat Jan 01 2022',
      );
    });
  });

  describe('pickups', () => {
    const event = {
      advertPickUps: {
        L: [
          {
            M: {
              pickedUp: { B: true },
              quantity: { N: 3 },
              reservationDate: { S: '2022-01-01' },
              reservedBySub: { S: 'abc' },
            },
          },
          {
            M: {
              pickedUp: { B: false },
              quantity: { N: 5 },
              reservationDate: { S: '2022-01-10' },
              reservedBySub: { S: 'def' },
            },
          },
        ],
      },
    } as unknown as AwsAdvert;

    let actual = undefined as Advert | undefined;

    beforeEach(() => {
      actual = mapAwsEvent(event);
    });

    it('should map first correctly', () => {
      expect(actual).not.toBeUndefined();
      expect(actual?.advertPickUps[0].pickedUp).toBeTruthy();
      expect(actual?.advertPickUps[0].quantity).toBe(3);
      expect(actual?.advertPickUps[0].reservedBySub).toBe('abc');
      expect(actual?.advertPickUps[0].reservationDate.toDateString()).toBe(
        'Sat Jan 01 2022',
      );
    });

    it('should map last correctly', () => {
      expect(actual).not.toBeUndefined();
      expect(actual?.advertPickUps[1].pickedUp).toBeFalsy();
      expect(actual?.advertPickUps[1].quantity).toBe(5);
      expect(actual?.advertPickUps[1].reservedBySub).toBe('def');
      expect(actual?.advertPickUps[1].reservationDate.toDateString()).toBe(
        'Mon Jan 10 2022',
      );
    });
  });
});
