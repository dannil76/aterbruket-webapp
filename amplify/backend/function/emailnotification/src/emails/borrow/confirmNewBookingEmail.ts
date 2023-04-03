import { SES } from 'aws-sdk';
import { Advert, AdvertBorrowCalendarEvent } from '../../models/haffaAdvert';
import {
  formatDate,
  getHaffaFirstName,
  getHaffaFullName,
  getReservedByUser,
  logDebug,
  logException,
} from '../../utils';
import { confirmBookingTemplate } from './templates';
import Config from '../../config';

const emailService = new SES();
const config = new Config();

export default async function confirmNewBookingEmail(
  newItem: Advert,
  calendarEvent: AdvertBorrowCalendarEvent,
): Promise<boolean> {
  logDebug(`[confirmNewBookingEmail] Start confirmNewBookingEmail.`);

  // Borrowed items get user from event, recycle items get user directly from item
  const haffaUser = await getReservedByUser(calendarEvent.borrowedBySub);

  if (!haffaUser) {
    logDebug(
      `[confirmNewBookingEmail] can't send e-mail missing reserved by user`,
    );

    return false;
  }

  if (!haffaUser.email) {
    logDebug(
      `[confirmNewBookingEmail] can't send e-mail missing email information ${calendarEvent.borrowedBySub}`,
    );

    return false;
  }

  const { title, contactPerson, id, department, email, phoneNumber } = newItem;
  const body = confirmBookingTemplate(
    title,
    getHaffaFullName(contactPerson),
    getHaffaFirstName(haffaUser),
    `${config.appUrl}/item/${id}`,
    department,
    email,
    phoneNumber,
    formatDate(calendarEvent.dateStart),
    formatDate(calendarEvent.dateEnd),
    calendarEvent.quantity,
    newItem.quantityUnit,
    newItem.quantity,
  );

  const toAddress = haffaUser.email;
  logDebug(
    `[confirmNewBookingEmail] Send email 
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
          Subject: { Data: `Du har reserverat "${title}"` },
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
        `[confirmNewBookingEmail] Send e-mail 
                to ${toAddress} 
                failed with ${typedError.message}`,
      );
    }

    return false;
  }

  logDebug(`[confirmNewBookingEmail] Email sent to ${toAddress}`);
  return true;
}
