import Config from '../../../config';

const config = new Config();

export default function confirmNewReservationEmail(
  title: string,
  contactPerson: string,
  reservationPerson: string,
  link: string,
  department: string,
  contactEmail: string,
  phone: string,
  fromDate: string,
  toDate: string,
  quantity: number,
  quantityUnit: string,
  totalQuantity: number,
): string {
  const quantityText = totalQuantity > 1 ? `${quantity}${quantityUnit} ` : '';

  return `
  <html>
    <body>
      <p>Hej ${reservationPerson}!</p>
      <p>Du har bokat ${quantityText}<a href="${link}">${title}</a> i Haffa mellan ${fromDate} - ${toDate}</p>
      <p>Har du några frågor eller behöver bestämma när och hur prylen ska hämtas kontakta prylens kontaktperson.</p>
      <p>
        Utlånas av: ${contactPerson}<br>
        Förvaltning: ${department}<br>
        Mejl: ${contactEmail}<br>
        Telefon: ${phone}<br>
      </p>
      <p>Gör så här när du ska hämta prylen:</p>
      <ul>
        <li>Öppna Haffa</li>
        <li>Leta upp annonsen för prylen under Haffat - <a href="${link}">Saker att hämta ut</a></li>
        <li>Klicka på Hämta ut</li>
        <li>Scanna QR-koden från etiketten på prylen</li>
        <li>Bekräfta uthämtning</li>
        <li>Grattis! Ta med din pryl &#127881;</li>
      </ul>
      <p>${config.emailSignature}</p>
    </body>
  </html>
  `;
}
