export default function returnReminderTemplate(
    id: string,
    contactPersonFullName: string,
    reservationPersonFirstName: string,
    title: string,
    department: string,
    email: string,
    phone: string,
    url: string,
): string {
    return `
    <html>
    <body>
    <p>Hej ${reservationPersonFirstName}!</p>
    <p>Lånetiden för "${title}" har gått ut och det här är en påminnelse om att inte glömma att lämna tillbaka den. &#128522;</p>
    <p>Vill du ändra datum för din bokning kan du göra det i Haffa  <a href="${url}/item/${id}">"${title}"</a></p>
    <p>Har du några frågor kontakta prylens kontaktperson.<br>
    Namn: ${contactPersonFullName} <br>
    Förvaltning: ${department} <br>
    Mejl: ${email} <br>
    Telefon: ${phone} <br>
    </p>
    <p>
    <p>Gör så här när du ska lämna igen prylen <br>
    <ol type="1">
    <li>Öppna Haffa ${title}</li>
    <li>Klicka på Lämna tillbaka</li>
    <li>Om prylen ska in i ett låst skåp visas koden</li>
    <li>Scanna QR-koden från etiketten på prylen</li>
    <li>Kontrollera att alla delar är med</li>
    <li>Lämna prylen &#128079;</li>
    </ol>
    <p>
    Mvh<br>
    Haffa-teamet genom<br>
    <a href="mailto:tommy.boije@helsingborg.se">Tommy Boije</a> & <a href="mailto:emma.sjoberg@helsingborg.se">Emma Sjöberg</a>
    </p>
    </body>
    </html>
  `;
}
