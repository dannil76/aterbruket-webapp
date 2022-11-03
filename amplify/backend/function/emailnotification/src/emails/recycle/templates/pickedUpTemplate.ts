export default function pickedUpEmail(
    title: string,
    contactPerson: string,
    reservationPerson: string,
    link: string,
    department: string,
    date: string,
    reservationEmail: string,
): string {
    return `
  <html>
  <body>
  <p>Hej ${contactPerson}!</p>

  <p><a href="${link}">${title}</a> är hämtad.</p>

  <p>
    Uthämtat av: ${reservationPerson}<br>
    Datum: ${date}<br>
    Förvaltning: ${department}<br>
    Mejl: ${reservationEmail}<br>
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
