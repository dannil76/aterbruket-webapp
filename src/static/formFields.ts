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
    condition: {
      field: "advertType",
      operator: "==",
      value: "recycle",
    },
  },
  {
    name: "category",
    fieldType: "select",
    disabled: false,
    required: true,
    title: "Kategori / Typ av sak",
    options: borrowCategories,
    condition: {
      field: "advertType",
      operator: "==",
      value: "borrow",
    },
  },
  {
    name: "allowedBorrowDateRange",
    dataType: "text",
    fieldType: "dateRangePicker",
    disabled: false,
    required: false,
    title: "Tillgänglig period",
    condition: {
      field: "advertType",
      value: "borrow",
      operator: "==",
    },
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
    condition: {
      field: "advertType",
      operator: "==",
      value: "recycle",
    },
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
    condition: {
      field: "advertType",
      operator: "==",
      value: "recycle",
    },
  },
  {
    name: "height",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Höjd",
    placeholder: "34 cm",
    condition: {
      field: "advertType",
      value: "recycle",
      operator: "==",
    },
  },
  {
    name: "width",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Bredd",
    placeholder: "34 cm",
    condition: {
      field: "advertType",
      operator: "==",
      value: "recycle",
    },
  },
  {
    name: "length",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Djup",
    placeholder: "34 cm",
    condition: {
      field: "advertType",
      value: "recycle",
      operator: "==",
    },
  },
  {
    name: "color",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    title: "Färg",
    placeholder: "Färg",
    condition: {
      field: "advertType",
      operator: "==",
      value: "recycle",
    },
  },
  {
    name: "material",
    dataType: "checkbox",
    fieldType: "input",
    disabled: false,
    title: "Material",
    options: materials,
    description: "Välj en eller flera",
    condition: {
      field: "advertType",
      operator: "==",
      value: "recycle",
    },
  },
  {
    name: "condition",
    fieldType: "select",
    disabled: false,
    required: true,
    title: "Skick",
    options: conditions,
    condition: {
      field: "advertType",
      operator: "==",
      value: "recycle",
    },
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
    condition: {
      field: "advertType",
      operator: "==",
      value: "recycle",
    },
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
    condition: {
      field: "advertType",
      operator: "==",
      value: "recycle",
    },
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
    condition: {
      field: "advertType",
      operator: "==",
      value: "borrow",
    },
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
    condition: {
      field: "advertType",
      operator: "==",
      value: "borrow",
    },
  },
  {
    name: "returnInformation",
    dataType: "text",
    fieldType: "input",
    disabled: false,
    required: true,
    title: "Hur du gör när du lämnar tillbaka prylen",
    placeholder: "",
    condition: {
      field: "advertType",
      operator: "==",
      value: "borrow",
    },
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
    condition: {
      field: "advertType",
      operator: "==",
      value: "borrow",
    },
  },
];
