import Config from '../../../config';

const config = new Config();

export default function missingAccessoriesTemplate(
  title: string,
  contactPerson: string,
  missingAccessories: string,
  reportedByUserName: string,
  reportedByName: string,
  lastReturnedByUserName: string,
  lastReturnedByName: string,
  lastReturnedByEmail: string,
): string {
  return `
  <html>
    <body>
      <p>Hej ${contactPerson}!</p>
      <p>Din kollega <a href="https://intranat.helsingborg.se/user/${reportedByUserName}">${reportedByName}</a> har lånat din delade "${title}" och angett att följande tillbehör saknas: ${missingAccessories}.</p>
      <p>Vid behov, ta kontakt med <a href="https://intranat.helsingborg.se/user/${lastReturnedByUserName}">${lastReturnedByName}</a> via ${lastReturnedByEmail}. Redigera gärna din annons om delningen skall fortsätta.</p>
      <p>Haffa är en pilot och vi testar oss fram för att förstå vad som fungerar bäst. Hör gärna av dig med frågor eller feedback! Tack för att du delar med dig och bidrar till minskad konsumtion av dubbla uppsättningar prylar i onödan.</p>
      <p>${config.emailSignature}</p>
    </body>
  </html>`;
}
