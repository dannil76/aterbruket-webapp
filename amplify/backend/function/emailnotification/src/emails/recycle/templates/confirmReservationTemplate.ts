export default function confirmNewReservationEmail(
  title: string,
  contactPerson: string,
  reservationPerson: string,
  link: string,
  department: string,
  contactEmail: string,
  phone: string,
  quantity: number,
  quantityUnit: string,
  totalQuantity: number,
): string {
  const quantityText = totalQuantity > 1 ? `${quantity}${quantityUnit} ` : '';

  return `
  <html>
  <body>
  <p>Hej ${reservationPerson}!</p>
  <p>Hello Dude!</p>

  <p>Du har reserverat ${quantityText}<a href="${link}">${title}</a> i Haffa.</p>
  <p>Har du några frågor eller behöver bestämma när och hur prylen ska hämtas kontakta prylens kontaktperson. </p>
  <p>${contactPerson}<br>
  ${department}<br>
  Mejl: ${contactEmail}<br>
  Telefon: ${phone}</p>
  </br>
  <p>Finns din pryl på Återbruket har du 14 dagar på dig att hämta den innan din reservation släpps.</p>
  </br>
  <p>Gör så här när du ska hämta prylen: </p>
  <ul>
  <li>Öppna Haffa</li>
  <li>Leta upp annonsen för prylen under Haffat - <a href="${link}">Saker att hämta ut</a></li>
  <li>Klicka på Hämta ut</li>
  <li>Scanna QR-koden från etiketten på prylen</li>
  <li>Bekräfta uthämtning</li>
  <li>Grattis! Ta med din pryl &#127881;</li>
</ul>

  <p>
    Mvh<br>
    Haffa-teamet genom<br>
    <a href="mailto:tommy.boije@helsingborg.se">Tommy Boije</a> & <a href="mailto:emma.sjoberg@helsingborg.se">Emma Sjöberg</a>
  </p>
  </body>
  </html>
  `;
}
