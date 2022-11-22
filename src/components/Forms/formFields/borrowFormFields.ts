import { IFields } from '../../../interfaces/IForm';
import { borrowCategories } from '../../../static/categories';
import { administrations, quantityUnits } from '../../../static/advertMeta';

const borrowFormFields = (editing?: boolean): IFields[] => {
    return [
        {
            name: 'advertType',
            fieldType: 'radio',
            disabled: false,
            title: 'Den är till för',
            required: true,
            attributes: {
                direction: 'column',
            },
            options: [
                {
                    id: 1,
                    key: 'recycle',
                    title: 'Återbruk',
                },
                {
                    id: 2,
                    key: 'borrow',
                    title: 'Utlåning',
                },
            ],
        },
        {
            name: 'images',
            fieldType: 'file',
            disabled: false,
            required: !editing,
            title: 'Lägg till en bild',
            attributes: {
                accept: 'image/png, image/jpeg',
                capture: true,
            },
        },
        {
            name: 'category',
            fieldType: 'select',
            disabled: false,
            required: true,
            title: 'Kategori / Typ av sak',
            options: borrowCategories,
        },
        {
            name: 'allowedBorrowDateRange',
            fieldType: 'dateRangePicker',
            disabled: false,
            required: false,
            title: 'Tillgänglig period',
            description:
                'Välj närifrån din pryl är tillgänglig för utlåning och hur länge. \n' +
                'Om du lämnar “slutdatum” tomt så blir din pryl tillgänglig tillsvidare. \n' +
                'PS: Du kan alltid ändra tidsperioden senare!\n',
        },
        {
            name: 'title',
            fieldType: 'text',
            disabled: false,
            required: true,
            title: 'Rubrik',
            description: 'Max 20 tecken',
            placeholder: 'Döp annonsen...',
            attributes: {
                maxLength: '20',
            },
        },
        {
            name: 'description',
            fieldType: 'textarea',
            disabled: false,
            title: 'Beskrivning',
            description:
                'En kort text om prylen som gör den intressant att haffa. Detaljerad information om mått, färg mm lämnar du i nästa steg 😊',
            placeholder: 'Beskriv grejen...',
            attributes: {
                maxLength: '300',
            },
        },
        {
            name: 'quantityLabel',
            fieldType: 'layout',
            title: 'Lagersaldo',
        },
        {
            name: 'quantity',
            fieldType: 'text',
            required: true,
            title: 'Lagersaldo',
            placeholder: '1',
            attributes: {
                inlineLabel: true,
                pattern: '[0-9]*',
            },
            description:
                'Om du inte vet mängden prylar kan du sätta den till 0.',
        },
        {
            name: 'quantityUnit',
            fieldType: 'select',
            required: true,
            title: 'Enhet',
            options: quantityUnits,
            attributes: {
                inlineLabel: true,
            },
        },
        {
            name: 'describeLabel',
            fieldType: 'layout',
            title: '',
            attributes: {
                content: [{ element: 'h4', value: 'Beskriv prylen' }],
            },
        },
        {
            name: 'accessories',
            fieldType: 'repeater',
            required: false,
            title: 'Tillbehör till prylen',
            disabled: false,
            description:
                'Lägg till prylens tillbehör / lösa delar (lista skapas som lånaren checkar av) - alla tillbehör behöver checkas av vid ut & inlämning.',
        },
        {
            name: 'accessRestriction',
            fieldType: 'select',
            disabled: false,
            required: true,
            title: 'Vilka får låna?',
            options: [
                {
                    id: 1,
                    key: 'none',
                    title: 'Alla',
                },
                {
                    id: 2,
                    key: 'selection',
                    title: 'Flera',
                },
            ],
        },
        {
            name: 'accessRestrictionSelection',
            fieldType: 'checkbox',
            disabled: false,
            required: false,
            title: '',
            options: administrations,
            attributes: {
                reverse: true,
                direction: 'column',
            },
            conditions: [
                {
                    field: 'accessRestriction',
                    operator: '==',
                    value: 'selection',
                },
            ],
        },
        {
            name: 'addressHeading',
            fieldType: 'layout',
            title: '',
            attributes: {
                content: [{ element: 'h4', value: 'Var finns prylen?' }],
            },
        },
        {
            name: 'company',
            fieldType: 'select',
            disabled: false,
            required: true,
            title: 'Förvaltning',
            options: administrations,
        },
        {
            name: 'department',
            fieldType: 'text',
            disabled: false,
            required: true,
            title: 'Avdelning',
            placeholder: 'ex. Digitaliseringsavdelningen',
        },
        {
            name: 'address',
            fieldType: 'text',
            disabled: false,
            required: true,
            title: 'Adress',
            placeholder: 'ex. Larmvägen 33',
        },
        {
            name: 'postalCode',
            fieldType: 'text',
            disabled: false,
            required: true,
            title: 'Postnummer',
            placeholder: '',
        },
        {
            name: 'city',
            fieldType: 'text',
            disabled: false,
            required: true,
            title: 'Ort',
            placeholder: 'Helsingborg',
        },
        {
            name: 'contactHeading',
            fieldType: 'layout',
            title: '',
            attributes: {
                content: [{ element: 'h4', value: 'Kontakt' }],
            },
        },
        {
            name: 'contactPerson',
            fieldType: 'text',
            disabled: false,
            required: true,
            title: 'Kontaktperson',
            placeholder: 'Kontaktperson',
        },
        {
            name: 'phoneNumber',
            fieldType: 'text',
            disabled: false,
            title: 'Telefon',
            placeholder: 'ex. 0701234567',
            attributes: {
                pattern: '[0-9]*',
            },
        },
        {
            name: 'email',
            fieldType: 'email',
            disabled: false,
            required: true,
            title: 'Epost',
            placeholder: 'namn.efternamn@helsingborg.se',
        },
        {
            name: 'pickupHeading',
            fieldType: 'layout',
            title: '',
            attributes: {
                content: [{ element: 'h4', value: 'Haffningen' }],
            },
        },
        {
            name: 'borrowDifficultyLevel',
            fieldType: 'select',
            disabled: false,
            required: true,
            title: 'Så här enkelt är det att haffa prylen',
            options: [
                {
                    id: 1,
                    key: 'easy',
                    title: '🟢 Superenkel',
                },
                {
                    id: 2,
                    key: 'medium',
                    title: '🟡 Enkel',
                },
                {
                    id: 3,
                    key: 'hard',
                    title: '🔴 Ganska svårt',
                },
            ],
        },
        {
            name: 'borrowDifficultyLevelDefaultDescription',
            fieldType: 'layout',
            title: '',
            disabled: false,
            attributes: {
                content: [
                    {
                        element: 'i',
                        value: 'Välj om det bara är att gå in och hämta, man behöver hjälp eller om man behöver komma i kontakt med en specifik person.',
                    },
                ],
            },
            conditions: [
                {
                    field: 'borrowDifficultyLevel',
                    operator: '==',
                    value: '',
                },
            ],
        },
        {
            name: 'borrowDifficultyLevelEasyDescription',
            fieldType: 'layout',
            title: '',
            disabled: false,
            attributes: {
                content: [
                    {
                        element: 'i',
                        value: 'Det går att komma in själv ”från gatan” och hitta prylen för att skanna dess QR-kod utan någon annan inblandad',
                    },
                ],
            },
            conditions: [
                {
                    field: 'borrowDifficultyLevel',
                    operator: '==',
                    value: 'easy',
                },
            ],
        },
        {
            name: 'borrowDifficultyLevelMediumDescription',
            fieldType: 'layout',
            title: '',
            disabled: false,
            attributes: {
                content: [
                    {
                        element: 'i',
                        value: 'Prylen finns i ett rum som bara de som jobbar där har tillgång till, någon behöver öppna dörren för dig etc.',
                    },
                ],
            },
            conditions: [
                {
                    field: 'borrowDifficultyLevel',
                    operator: '==',
                    value: 'medium',
                },
            ],
        },
        {
            name: 'borrowDifficultyLevelHardDescription',
            fieldType: 'layout',
            title: '',
            disabled: false,
            attributes: {
                content: [
                    {
                        element: 'i',
                        value: 'Prylen finns i ett låst skåp bakom en låst dörr. Du behöver få tag i en viss person för att få hjälp att komma in.',
                    },
                ],
            },
            conditions: [
                {
                    field: 'borrowDifficultyLevel',
                    operator: '==',
                    value: 'hard',
                },
            ],
        },
        {
            name: 'pickUpInstructions',
            fieldType: 'text',
            disabled: false,
            title: 'Så här haffar du prylen',
            placeholder: 'Du behöver...',
            required: true,
            description: 'Beskriv hur haffaren hämtar ut prylen.',
        },
        {
            name: 'pickUpInformation',
            fieldType: 'text',
            disabled: false,
            title: 'Bra att veta inför uthämtning',
            placeholder: 'Du behöver...',
            required: true,
            description:
                't ex. hur prylen är paketerad, om det ska laddas batterier etc.',
        },
        {
            name: 'lockerCodeInformation',
            fieldType: 'text',
            disabled: false,
            title: 'Info om låst skåp',
            placeholder: 'Skåpet står...',
            required: false,
            description:
                'Om prylen finns i ett skåp med kodlås och någon info behövs om det så kan du skriva det här.',
        },
        {
            name: 'lockerCode',
            fieldType: 'text',
            disabled: false,
            title: 'Kod till lås',
            placeholder: '1234',
            required: false,
            description: 'Kod till eventuellt kodlås',
        },
        {
            name: 'returnInformation',
            fieldType: 'text',
            disabled: false,
            required: true,
            title: 'Bra att veta vid återlämning',
            placeholder: 'Lämna...',
            description:
                'Behöver lånaren veta något speciellt för återlämningen?',
        },
        {
            name: 'missingItemsInformation',
            fieldType: 'text',
            disabled: false,
            title: 'Om något går sönder eller försvinner',
            placeholder: 'Om du tappar bort...',
            required: true,
            description:
                'Har ni nån smart lösning när saker pajar eller försvinner berätta det här.',
        },
    ];
};

export default borrowFormFields;

borrowFormFields.defaultProps = {
    editing: false,
};
