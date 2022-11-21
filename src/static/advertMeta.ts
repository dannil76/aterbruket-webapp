import { ItemAdvertType, ItemCondition } from '../graphql/models';
import { IOption } from '../interfaces/IForm';

const advertTypes = [
    {
        id: 1,
        key: ItemAdvertType.borrow,
        title: 'Delning',
    },
    {
        id: 2,
        key: ItemAdvertType.recycle,
        title: 'Återbruk',
    },
] as IOption[];

const conditions = [
    {
        id: 1,
        key: ItemCondition.Anew,
        title: 'Nyskick',
    },
    {
        id: 2,
        key: ItemCondition.Bgood,
        title: 'Bra',
    },
    {
        id: 3,
        key: ItemCondition.Cworn,
        title: 'Sliten',
    },
];

const areaOfUse = [
    {
        id: 1,
        key: 'indoors',
        title: 'Inne',
    },
    {
        id: 2,
        key: 'outside',
        title: 'Ute',
    },
];

const units = [
    {
        id: 1,
        key: 'units',
        title: 'Stycken',
    },
    {
        id: 2,
        key: 'kilos',
        title: 'Kilogram',
    },
    {
        id: 3,
        key: 'meters',
        title: 'Meter',
    },
    {
        id: 4,
        key: 'cubicMeters',
        title: 'Kubikmeter',
    },
];

const materials = [
    {
        id: 1,
        key: 'wood',
        title: 'Trä',
    },
    {
        id: 2,
        key: 'plastic',
        title: 'Plast',
    },
    {
        id: 3,
        key: 'metal',
        title: 'Metall',
    },
    {
        id: 4,
        key: 'other',
        title: 'Annat',
    },
];

const administrations = [
    {
        id: 1,
        key: 'arbetsmarknadsforvaltningen',
        title: 'Arbetsmarknadsförvaltningen',
    },
    {
        id: 2,
        key: 'fastighetsforvaltningen',
        title: 'Fastighetsförvaltningen',
    },
    {
        id: 3,
        key: 'kulturforvaltningen',
        title: 'Kulturförvaltningen',
    },
    {
        id: 4,
        key: 'miljoforvaltningen',
        title: 'Miljöförvaltningen',
    },
    {
        id: 5,
        key: 'skolOchFritidsforvaltningen',
        title: 'Skol- och fritidsförvaltningen',
    },
    {
        id: 6,
        key: 'socialforvaltningen',
        title: 'Socialförvaltningen',
    },
    {
        id: 7,
        key: 'stadsbyggnadsforvaltningen',
        title: 'Stadsbyggnadsförvaltningen',
    },
    {
        id: 8,
        key: 'stadsledningsforvaltningen',
        title: 'Stadsledningsförvaltningen',
    },
    {
        id: 9,
        key: 'vardOchOmsorgsforvaltningen',
        title: 'Vård- och omsorgsförvaltningen',
    },
];

export {
    advertTypes,
    conditions,
    areaOfUse,
    units,
    materials,
    administrations,
};
