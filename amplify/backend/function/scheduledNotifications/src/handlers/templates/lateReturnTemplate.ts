export default function lateReturnTemplate(
    id: string,
    contactPersonFirstName: string,
    reservationPersonFirstName: string,
    reservationPersonFullName: string,
    title: string,
    startDate: string,
    endDate: string,
    department: string,
    email: string,
    url: string,
): string {
    return `
    <html>
    <body>
    <p>Hej ${contactPersonFirstName}!</p>
    <p>Lånetiden har gått ut och ${reservationPersonFirstName} har inte lämnat tillbaka <a href="${url}/item/${id}">"${title}"</a>.</p>
    <p>Utlåningsperiod: ${startDate} - ${endDate}.<br>
    Namn: ${reservationPersonFullName} <br>
    Förvaltning: ${department} <br>
    Mejl: ${email} <br>
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
