export interface Category {
    id: number;
    key: string;
    title: string;
}

const sortCategories = (unsortedCategories: Category[]) => {
    const sortedCategories = unsortedCategories.sort((a, b) => {
        if (a.title < b.title) {
            return -1;
        }
        if (a.title > b.title) {
            return 1;
        }
        return 0;
    });

    return sortedCategories;
};

export const borrowCategories = sortCategories([
    {
        id: 2,
        key: 'furniture',
        title: 'Möbler',
    },
    {
        id: 3,
        key: 'tool',
        title: 'Verktyg',
    },
    {
        id: 4,
        key: 'vehicle',
        title: 'Fordon',
    },
    {
        id: 5,
        key: 'workshop',
        title: 'Workshop',
    },
    {
        id: 6,
        key: 'media',
        title: 'Video & Ljud',
    },
    {
        id: 7,
        key: 'vrar',
        title: 'VR, AR',
    },
    {
        id: 8,
        key: 'robot',
        title: 'Robotar',
    },
    {
        id: 9,
        key: 'officeSupplies',
        title: 'Kontor',
    },
    {
        id: 10,
        key: 'computerPhoneTablet',
        title: 'Dator, telefon, padda',
    },
    {
        id: 26,
        key: 'other',
        title: 'Övrigt',
    },
    {
        id: 27,
        key: 'clothes',
        title: 'Kläder',
    },
    {
        id: 28,
        key: 'skill',
        title: 'Kompetens',
    },
]);

export const recycleCategories = sortCategories([
    {
        id: 11,
        key: 'kidsFurniture',
        title: 'Barnmöbler',
    },
    {
        id: 12,
        key: 'table',
        title: 'Bord',
    },
    {
        id: 13,
        key: 'other',
        title: 'Övrigt',
    },
    {
        id: 14,
        key: 'storageFurniture',
        title: 'Förvaringsmöbler',
    },
    {
        id: 15,
        key: 'raiseAndLowerableDesk',
        title: 'Höj- och sänkbart skrivbord',
    },
    {
        id: 16,
        key: 'officeChair',
        title: 'Kontorsstolar',
    },
    {
        id: 17,
        key: 'sparepart',
        title: 'Reservdelar och Tillbehör',
    },
    {
        id: 18,
        key: 'seatingFurniture',
        title: 'Sittmöbler',
    },
    {
        id: 19,
        key: 'desk',
        title: 'Skrivbord',
    },
    {
        id: 20,
        key: 'sofaAndBench',
        title: 'Soffor och Bänkar',
    },
    {
        id: 21,
        key: 'wanted',
        title: 'Sökes',
    },
    {
        id: 22,
        key: 'painting',
        title: 'Tavlor',
    },
    {
        id: 23,
        key: 'outdoorItem',
        title: 'UteÅterbrukat',
    },
    {
        id: 24,
        key: 'appliances',
        title: 'Vitvaror',
    },
    {
        id: 25,
        key: 'constructionMaterial',
        title: 'Återbygg',
    },
]);

// TODO: parents
export const allCategories = sortCategories([
    ...borrowCategories,
    ...recycleCategories,
]);
