import {
  getCategoriesByParent,
  getCategoriesExceptByParent,
} from "../utils/handleCategories";
import { conditions, areaOfUse, materials } from "./advertMeta";

const recycleCategories = getCategoriesByParent([1]);
const borrowCategories = getCategoriesExceptByParent([1]);

export default [
  {
    name: "advertType",
    dataType: "text",
    fieldType: "radio",
    disabled: false,
    title: "Den är till för",
    required: true,
    options: [
      {
        id: 1,
        key: "recycle",
        title: "Återbruk",
      },
      {
        id: 2,
        key: "borrow",
        title: "Utlåning",
      },
    ],
  },
  {
    name: "images",
    dataType: "file",
    fieldType: "input",
    disabled: false,
    required: true,
    title: "Lägg till en bild",
  },
  {
    name: "category",
    fieldType: "select",
    disabled: false,
    required: true,
    title: "Kategori / Typ av möbel",
    options: recycleCategories,
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "recycle",
      },
    ],
  },
  {
    name: "category",
    fieldType: "select",
    disabled: false,
    required: true,
    title: "Kategori / Typ av sak",
    options: borrowCategories,
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "borrow",
      },
    ],
  },
  {
    name: "allowedBorrowDateRange",
    dataType: "text",
    fieldType: "dateRangePicker",
    disabled: false,
    required: false,
    title: "Tillgänglig period",
    conditions: [
      {
        field: "advertType",
        value: "borrow",
        operator: "==",
      },
    ],
  },
  {
    name: "title",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    required: true,
    title: "Rubrik",
    description: "Max 20 tecken",
    placeholder: "Döp annonsen...",
  },
  {
    name: "aterbruketId",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Återbruket ID",
    placeholder: "ex. 4435A",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "recycle",
      },
    ],
  },
  {
    name: "description",
    fieldType: "textarea",
    disabled: false,
    title: "Beskrivning",
    description:
      "En kort text om prylen som gör den intressant att haffa. Detaljerad information om mått, färg mm lämnar du i nästa steg 😊",
    placeholder: "Beskriv grejen...",
  },
  {
    name: "quantity",
    dataType: "number",
    fieldType: "input",
    disabled: false,
    title: "Antal",
    placeholder: "Hur många?",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "recycle",
      },
    ],
  },
  {
    name: "height",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Höjd",
    placeholder: "34 cm",
    conditions: [
      {
        field: "advertType",
        value: "recycle",
        operator: "==",
      },
    ],
  },
  {
    name: "width",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Bredd",
    placeholder: "34 cm",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "recycle",
      },
    ],
  },
  {
    name: "length",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Djup",
    placeholder: "34 cm",
    conditions: [
      {
        field: "advertType",
        value: "recycle",
        operator: "==",
      },
    ],
  },
  {
    name: "color",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Färg",
    placeholder: "Färg",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "recycle",
      },
    ],
  },
  {
    name: "material",
    dataType: "checkbox",
    fieldType: "input",
    disabled: false,
    title: "Material",
    options: materials,
    description: "Välj en eller flera",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "recycle",
      },
    ],
  },
  {
    name: "conditions",
    fieldType: "select",
    disabled: false,
    required: true,
    title: "Skick",
    options: conditions,
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "recycle",
      },
    ],
  },
  {
    name: "areaOfUse",
    dataType: "checkbox",
    title: "Användningsområde",
    fieldType: "input",
    disabled: false,
    required: true,
    options: areaOfUse,
    description: "Välj en eller flera",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "recycle",
      },
    ],
  },
  {
    name: "purchasePrice",
    dataType: "number",
    fieldType: "input",
    disabled: false,
    required: false,
    title: "Inköpspris",
    placeholder: "Inköpspris",
    description:
      "Vet du inte exakt vad den köptes in för?\n\nAnge då en uppskattning av priset.",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "recycle",
      },
    ],
  },
  {
    name: "accessories",
    fieldType: "repeater",
    dataType: "text",
    required: false,
    title: "Tillbehör till prylen",
    disabled: false,
    description:
      "Lägg till prylens tillbehör / lösa delar (lista skapas som lånaren checkar av) - alla tillbehör behöver checkas av vid ut & inlämning.",
    conditions: [
        field: "advertType",
        operator: "==",
        value: "borrow",
      },
    ],
  },
  {
    name: "pickUpInformation",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Bra att veta inför uthämtning",
    placeholder: "Du behöver...",
    required: true,
    description:
      "t ex. hur prylen är paketerad, om det ska laddas batterier etc.",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "borrow",
      },
    ],
  },
  {
    name: "missingItemsInformation",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Om det saknas något vid återlämningen",
    placeholder: "Om du glömt...",
    required: true,
    description:
      "Beskriv hur lånaren ska göra om något saknas vid återlämningen ... 😊",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "borrow",
      },
    ],
  },
  {
    name: "returnInformation",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    required: true,
    title: "Hur du gör när du lämnar tillbaka prylen",
    placeholder: "",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "borrow",
      },
    ],
  },
  {
    name: "company",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    required: true,
    title: "Förvaltning",
    placeholder: "ex. Stadsledningsförvaltningen",
  },
  {
    name: "department",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    required: true,
    title: "Avdelning",
    placeholder: "ex. Digitaliseringsavdelningen",
  },
  {
    name: "location",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    required: true,
    title: "Adress",
    placeholder: "ex. Larmvägen 33 254 56 Helsingborg",
  },
  {
    name: "contactPerson",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    required: true,
    title: "Kontaktperson",
    placeholder: "Kontaktperson",
  },
  {
    name: "phoneNumber",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Telefon",
    placeholder: "ex. 0701234567",
  },
  {
    name: "email",
    dataType: "email",
    fieldType: "input",
    disabled: false,
    required: true,
    title: "Epost",
    placeholder: "namn.efternamn@helsingborg.se",
  },
  {
    name: "pickUpInstructions",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Så här haffar du prylen",
    placeholder: "Du behöver...",
    required: true,
    description: "Beskriv hur haffaren hämtar ut prylen.",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "borrow",
      },
    ],
  },
  {
    name: "borrowDifficultyLevel",
    fieldType: "select",
    disabled: false,
    required: true,
    title: "Så här enkelt är det att haffa prylen",
    options: [
      {
        id: 1,
        key: "easy",
        title: "🟢 Superenkel",
      },
      {
        id: 2,
        key: "medium",
        title: "🟡 Enkel",
      },
      {
        id: 3,
        key: "hard",
        title: "🔴 Ganska svårt",
      },
    ],
    description:
      "Välj om det bara är att gå in och hämta, man behöver hjälp eller om man behöver komma i kontakt med en specifik person.",
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "borrow",
      },
    ],
  },
  {
    name: "borrowDifficultyLevelEasyDescription",
    fieldType: "layout",
    title: "Superenkel",
    disabled: false,
    attributes: {
      content:
        "Det går att komma in själv ”från gatan” och hitta prylen för att scanna dess QR-kod utan någon annan inblandad.",
    },
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "borrow",
      },
      {
        field: "borrowDifficultyLevel",
        operator: "==",
        value: "easy",
      },
    ],
  },
  {
    name: "borrowDifficultyLevelMediumDescription",
    fieldType: "layout",
    title: "Enkel",
    disabled: false,
    attributes: {
      content:
        "Prylen finns i ett rum som bara de som jobbar där har tillgång till, någon behöver öppna dörren för dig etc.",
    },
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "borrow",
      },
      {
        field: "borrowDifficultyLevel",
        operator: "==",
        value: "medium",
      },
    ],
  },
  {
    name: "borrowDifficultyLevelHardDescription",
    fieldType: "layout",
    title: "Ganska svårt",
    disabled: false,
    attributes: {
      content:
        "Prylen finns i ett låst skåp bakom en låst dörr. Du behöver få tag i en viss person för att få hjälp att komma in.",
    },
    conditions: [
      {
        field: "advertType",
        operator: "==",
        value: "borrow",
      },
      {
        field: "borrowDifficultyLevel",
        operator: "==",
        value: "hard",
      },
    ],
  },
];
