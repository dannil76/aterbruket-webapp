export default function pickUpReminderTemplate(
    id: string,
    contactPersonFullName: string,
    reservationPersonFirstName: string,
    daysSinceReservation: number,
    daysUntilAutomaticCancel: number,
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
    <p>Det har gått ${daysSinceReservation} dagar sen din reservation av <a href="${url}/item/${id}">"${title}"</a> och det här är en påminnelse om att inte glömma bort att hämta den. &#128522;</p>
    <p>Finns din pryl på Återbruket har du ${daysUntilAutomaticCancel} dagar på dig att hämta den innan din reservation släpps.</p>
    <p>Har du några frågor eller behöver bestämma när och hur prylen ska hämtas kontakta prylens kontaktperson. <br>
    Namn: ${contactPersonFullName} <br>
    Förvaltning: ${department} <br>
    Mejl: ${email} <br>
    Telefon: ${phone} <br>
    </p>
    <p>
    <p>Gör så här när du ska hämta prylen: <br>
    <ol type="1">
    <li>Öppna Haffa</li>
    <li>Leta upp annonsen för prylen under Haffat – Saker att hämta ut</li>
    <li>Klicka på Hämta ut</li>
    <li>Scanna QR-koden från etiketten på prylen</li>
    <li>Bekräfta uthämtning</li>
    <li>Grattis! Ta med din pryl &#127881;</li>
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
