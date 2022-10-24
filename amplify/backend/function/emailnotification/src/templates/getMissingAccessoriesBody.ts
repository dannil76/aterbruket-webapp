import { HaffaUser } from '../models/haffaUser';

export default function getMissingAccessoriesBody(
    title: string,
    contactPerson: string,
    missingAccessories: string,
    reportedByUser: HaffaUser,
    lastReturnedByUser: HaffaUser,
): string {
    return `
  <html>
  <body>
  <p>Hej ${contactPerson}!</p>

  <p>Din kollega <a href="https://intranat.helsingborg.se/user/${reportedByUser.username}">${reportedByUser.name}</a> har lånat din delade "${title}" och angett att följande tillbehör saknas: ${missingAccessories}.</p>

  <p>Vid behov, ta kontakt med <a href="https://intranat.helsingborg.se/user/${lastReturnedByUser.username}">${lastReturnedByUser.name}</a> via ${lastReturnedByUser.email}. Redigera gärna din annons om delningen skall fortsätta.</p>
  <p>Haffa är en pilot och vi testar oss fram för att förstå vad som fungerar bäst. Hör gärna av dig med frågor eller feedback! Tack för att du delar med dig och bidrar till minskad konsumtion av dubbla uppsättningar prylar i onödan. </p>

  <p>
    Mvh<br>
    Haffa-teamet genom<br>
    <a href="mailto:tommy.boije@helsingborg.se">Tommy Boije</a> & <a href="mailto:emma.sjoberg@helsingborg.se">Emma Sjöberg</a>
  </p>
  </body>
  </html>
  `;
}
