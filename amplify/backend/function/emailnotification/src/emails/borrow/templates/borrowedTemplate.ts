export default function borrowedTemplate(
    title: string,
    contactPerson: string,
    reservationPersonFirstName: string,
    reservationPersonFullName: string,
    link: string,
    department: string,
    fromDate: string,
    toDate: string,
    reservationPersonEmail: string,
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

  <p>${reservationPersonFirstName} har hämtat <a href="${link}">${title}</a>.</p>

  <p>
    Utlåningsperiod: ${fromDate} - ${toDate}<br>${quantityText}
    Uthämtat av: ${reservationPersonFullName}<br>
    Förvaltning: ${department}<br>
    Mejl: ${reservationPersonEmail}<br>
  </p>
  <p>
    Mvh<br>
    Haffa-teamet genom<br>
    <a href="mailto:tommy.boije@helsingborg.se">Tommy Boije</a> & <a href="mailto:emma.sjoberg@helsingborg.se">Emma Sjöberg</a>
  </p>
  </body>
  </html>
  `;
}
