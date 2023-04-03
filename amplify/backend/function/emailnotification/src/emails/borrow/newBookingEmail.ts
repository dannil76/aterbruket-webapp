import { SES } from 'aws-sdk';
import { Advert, AdvertBorrowCalendarEvent } from '../../models/haffaAdvert';
import {
  getReservedByUser,
  logDebug,
  logException,
  formatDate,
  getHaffaFirstName,
  getHaffaFullName,
} from '../../utils';
import { newBookingTemplate } from './templates';
import Config from '../../config';

const emailService = new SES();
const config = new Config();

export default async function newBookingEmail(
  newItem: Advert,
  calendarEvent: AdvertBorrowCalendarEvent,
): Promise<boolean> {
  logDebug(`[newBookingEmail] Start newBookingEmail.`);

  // Borrowed items get user from event, recycle items get user directly from item
  const reservedBySub = calendarEvent.borrowedBySub;
  const haffaUser = await getReservedByUser(reservedBySub);

  if (!haffaUser) {
    logDebug(`[newBookingEmail] can't send e-mail missing reserved by user`);

    return false;
  }

  if (!haffaUser.email) {
    logDebug(
      `[newBookingEmail] can't send e-mail missing email information ${reservedBySub}`,
    );

    return false;
  }

  const { title, contactPerson, id, email } = newItem;
  const body = newBookingTemplate(
    title,
    getHaffaFirstName(contactPerson),
    getHaffaFullName(haffaUser),
    `${config.appUrl}/item/${id}`,
    haffaUser ? haffaUser['custom:department'] ?? '' : '',
    formatDate(calendarEvent.dateStart),
    formatDate(calendarEvent.dateEnd),
    haffaUser.email,
    calendarEvent.quantity,
    newItem.quantityUnit,
    newItem.quantity,
  );

  const toAddress = email;
  logDebug(
    `[newBookingEmail] Send email 
        from ${config.senderDefaultEmail} 
        to ${toAddress}.`,
  );

  try {
    await emailService
      .sendEmail({
        Destination: {
          ToAddresses: [toAddress],
        },
        Source: config.senderDefaultEmail,
        Message: {
          Subject: { Data: `"${title}" har blivit reserverad` },
          Body: {
            Html: { Data: body },
          },
        },
      })
      .promise();
  } catch (error) {
    const typedError = error as Error;
    if (typedError) {
      logException(
        `[newBookingEmail] Send e-mail 
                to ${toAddress} 
                failed with ${typedError.message}`,
      );
    }

    return false;
  }

  logDebug(`[newBookingEmail] Email sent to ${toAddress}`);
  return true;
}
