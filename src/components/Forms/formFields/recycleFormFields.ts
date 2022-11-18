import { IFields } from '../../../interfaces/IForm';
import { recycleCategories } from '../../../static/categories';
import {
    conditions,
    areaOfUse,
    materials,
    administrations,
} from '../../../static/advertMeta';

const recycleFormFields = (editing?: boolean): IFields[] => {
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
            title: 'Kategori / Typ av möbel',
            options: recycleCategories,
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
            name: 'aterbruketId',
            fieldType: 'text',
            disabled: false,
            title: 'Återbruket ID',
            placeholder: 'ex. 4435A',
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
            name: 'quantity',
            fieldType: 'number',
            disabled: false,
            title: 'Antal',
            placeholder: 'Hur många?',
        },
        {
            name: 'measurementLabel',
            fieldType: 'layout',
            title: 'Mått',
            disabled: false,
            attributes: {},
        },
        {
            name: 'height',
            fieldType: 'text',
            disabled: false,
            title: 'Höjd',
            placeholder: '34 cm',
            attributes: {
                inlineLabel: true,
                pattern: '[0-9]*',
            },
        },
        {
            name: 'width',
            fieldType: 'text',
            disabled: false,
            title: 'Bredd',
            placeholder: '34 cm',
            attributes: {
                inlineLabel: true,
                pattern: '[0-9]*',
            },
        },
        {
            name: 'length',
            fieldType: 'text',
            disabled: false,
            title: 'Djup',
            placeholder: '34 cm',
            attributes: {
                inlineLabel: true,
                pattern: '[0-9]*',
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
            name: 'color',
            fieldType: 'text',
            disabled: false,
            title: 'Färg',
            placeholder: 'Färg',
        },
        {
            name: 'material',
            fieldType: 'checkbox',
            disabled: false,
            title: 'Material',
            options: materials,
            description: 'Välj en eller flera',
            attributes: {
                direction: 'row',
            },
        },
        {
            name: 'condition',
            fieldType: 'select',
            disabled: false,
            required: true,
            title: 'Skick',
            options: conditions,
        },
        {
            name: 'areaOfUse',
            fieldType: 'checkbox',
            title: 'Användningsområde',
            disabled: false,
            required: true,
            options: areaOfUse,
            description: 'Välj en eller flera',
            attributes: {
                direction: 'column',
            },
        },
        {
            name: 'purchasePrice',
            fieldType: 'number',
            disabled: false,
            required: false,
            title: 'Inköpspris',
            placeholder: 'Inköpspris',
            description:
                'Vet du inte exakt vad den köptes in för?\n\nAnge då en uppskattning av priset.',
            attributes: {
                pattern: '[0-9]*',
            },
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
    ];
};

export default recycleFormFields;

recycleFormFields.defaultProps = {
    editing: false,
};
