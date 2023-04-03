import Config from '../../../config';

const config = new Config();

export default function returnedEmail(
  title: string,
  contactPerson: string,
  reservationPersonFirstName: string,
  reservationPersonFullName: string,
  link: string,
  department: string,
  fromDate: string,
  toDate: string,
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
      <p>Hej ${contactPerson}!</p>
      <p>${reservationPersonFirstName} har lämnat tillbaka <a href="${link}">${title}</a>.</p>
      <p>
        Utlåningsperiod: ${fromDate} - ${toDate}<br>
        ${quantityText}
        Lämnad av: ${reservationPersonFullName}<br>
        Förvaltning: ${department}<br>
        Mejl: ${reservationEmail}<br>
      </p>
      <p>${config.emailSignature}</p>
    </body>
  </html>`;
}
