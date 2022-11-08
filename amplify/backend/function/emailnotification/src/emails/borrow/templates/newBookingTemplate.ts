export default function notifyAboutNewReservationEmail(
    title: string,
    contactPerson: string,
    reservationPerson: string,
    link: string,
    department: string,
    fromDate: string,
    toDate: string,
    reservationEmail: string,
): string {
    return `
  <html>
  <body>
  <p>Hej ${contactPerson}!<br>
  <br>
  En kollega vill låna <a href="${link}">${title}</a>.</p>
  
  <p>Utlåningsperiod: ${fromDate} - ${toDate}<br>
  Bokad av: ${reservationPerson}<br>
  Förvaltning: ${department ?? ''} <br>
  Mejl: ${reservationEmail} <br>
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