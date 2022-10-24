export default function createNewAdvertBody(
    id: string,
    contactPerson: string,
    department: string,
    address: string,
    postalCode: string,
    phoneNumber: string,
    email: string,
    url: string,
    city: string,
): string {
    return `
    <html>
    <body>
    <p>Hej Återbruket!</p>
    <p>En ny QR-kod behöver skrivas ut!</p>
    <p>1. Här finns den: <a href="${url}/item/${id}">Öppna den här länken i en webbläsare</a></p>
    <p>2. Klicka på etiketten med QR-koden för att ladda ner den som en PDF</p>
    <p>3. Hitta bilden på etiketten med QR-koden på din dator och skriv ut den på etikettskrivaren</p>
    <p>4. Posta den i ett brunt internpostkuvert till:</p>
    <p>
      ${contactPerson}<br>
      ${department}<br>
      ${address}, ${postalCode}, ${city}<br>
    </p>
    <p>
      Uppgifter till ${contactPerson}:<br>
      Tel: ${phoneNumber}<br>
      E-mail: ${email}
    </p>
    <br>
    <p>Ha en fin dag!<br>
    / Haffa-appen
    </p>
    </body>
    </html>
  `;
}
