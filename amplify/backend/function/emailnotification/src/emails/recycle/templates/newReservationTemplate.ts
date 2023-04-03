import Config from '../../../config';

const config = new Config();

export default function notifyAboutNewReservationEmail(
  title: string,
  contactPerson: string,
  reservationPerson: string,
  link: string,
  department: string,
  date: string,
  reservationEmail: string,
  quantity: number,
  quantityUnit: string,
  totalQuantity: number,
): string {
  const quantityText =
    totalQuantity > 1 ? `Antal: ${quantity}${quantityUnit}<br>` : '';

  return `
  <html>
    <body>
      <p>
        Hej ${contactPerson}!<br><br>
        <a href="${link}">${title}</a> har blivit reserverad.
      </p>
      <p>
        Reserverad av ${reservationPerson}<br>
        ${quantityText}
        Datum: ${date}<br>
        Förvaltning: ${department ?? ''}<br>
        Mejl: ${reservationEmail}<br>
      </p>
      <p>${config.emailSignature}</p>
    </body>
  </html>`;
}
