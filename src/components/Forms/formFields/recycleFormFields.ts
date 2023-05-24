import { IFields } from '../../../interfaces/IForm';
import { recycleCategories } from '../../../static/categories';
import {
    conditions,
    areaOfUse,
    materials,
    administrations,
    quantityUnits,
} from '../../../static/advertMeta';

const recycleFormFields = (editing?: boolean): IFields[] => {
    return [
        {
            name: 'advertType',
            fieldType: 'radio',
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
            required: !editing,
            title: 'Lägg till en bild',
            attributes: {
                accept: 'image/png, image/jpeg',
            },
        },
        {
            name: 'category',
            fieldType: 'select',
            required: true,
            title: 'Kategori',
            options: recycleCategories,
        },
        {
            name: 'title',
            fieldType: 'text',
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
            title: 'Återbruket ID',
            placeholder: 'ex. 4435A',
        },
        {
            name: 'description',
            fieldType: 'textarea',
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
            name: 'measurementLabel',
            fieldType: 'layout',
            title: 'Mått',
        },
        {
            name: 'height',
            fieldType: 'text',
            title: 'Höjd',
            placeholder: '34',
            attributes: {
                inlineLabel: true,
                pattern: '[0-9]*',
            },
        },
        {
            name: 'width',
            fieldType: 'text',
            title: 'Bredd',
            placeholder: '34',
            attributes: {
                inlineLabel: true,
                pattern: '[0-9]*',
            },
        },
        {
            name: 'length',
            fieldType: 'text',
            title: 'Djup',
            placeholder: '34',
            attributes: {
                inlineLabel: true,
                pattern: '[0-9]*',
            },
            description: 'Måtten anges i cm.',
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
            title: 'Färg',
            placeholder: 'Färg',
        },
        {
            name: 'material',
            fieldType: 'checkbox',
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
            required: true,
            title: 'Skick',
            options: conditions,
        },
        {
            name: 'areaOfUse',
            fieldType: 'checkbox',
            title: 'Användningsområde',
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
            required: true,
            title: 'Förvaltning',
            options: administrations,
        },
        {
            name: 'department',
            fieldType: 'text',
            required: true,
            title: 'Avdelning',
            placeholder: 'ex. Digitaliseringsavdelningen',
        },
        {
            name: 'address',
            fieldType: 'text',
            required: true,
            title: 'Adress',
            placeholder: 'ex. Larmvägen 33',
        },
        {
            name: 'postalCode',
            fieldType: 'text',
            required: true,
            title: 'Postnummer',
            placeholder: '',
        },
        {
            name: 'city',
            fieldType: 'text',
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
            required: true,
            title: 'Kontaktperson',
            placeholder: 'Kontaktperson',
        },
        {
            name: 'phoneNumber',
            fieldType: 'text',
            title: 'Telefon',
            placeholder: 'ex. 0701234567',
            attributes: {
                pattern: '[0-9]*',
            },
        },
        {
            name: 'email',
            fieldType: 'email',
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
