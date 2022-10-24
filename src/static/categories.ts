const categories = [
    // ***** Top level ***** //
    {
        id: 1,
        parent: null,
        key: 'recycle',
        title: 'Återbruk',
    },
    {
        id: 2,
        parent: null,
        key: 'furniture',
        title: 'Möbler',
    },
    {
        id: 3,
        parent: null,
        key: 'tool',
        title: 'Verktyg',
    },
    {
        id: 4,
        parent: null,
        key: 'vehicle',
        title: 'Fordon',
    },
    {
        id: 5,
        parent: null,
        key: 'workshop',
        title: 'Workshop',
    },
    {
        id: 6,
        parent: null,
        key: 'media',
        title: 'Video & Ljud',
    },
    {
        id: 7,
        parent: null,
        key: 'vrar',
        title: 'VR, AR',
    },
    {
        id: 8,
        parent: null,
        key: 'robot',
        title: 'Robotar',
    },
    {
        id: 9,
        parent: null,
        key: 'officeSupplies',
        title: 'Kontor',
    },
    {
        id: 10,
        parent: null,
        key: 'computerPhoneTablet',
        title: 'Dator, telefon, padda',
    },
    {
        id: 26,
        parent: null,
        key: 'other',
        title: 'Övrigt',
    },
    {
        id: 27,
        parent: null,
        key: 'clothes',
        title: 'Kläder',
    },
    {
        id: 28,
        parent: null,
        key: 'skill',
        title: 'Kompetens',
    },
    // ***** Recycle ***** //
    {
        id: 11,
        parent: 1,
        key: 'kidsFurniture',
        title: 'Barnmöbler',
    },
    {
        id: 12,
        parent: 1,
        key: 'table',
        title: 'Bord',
    },
    {
        id: 13,
        parent: 1,
        key: 'other',
        title: 'Övrigt',
    },
    {
        id: 14,
        parent: 1,
        key: 'storageFurniture',
        title: 'Förvaringsmöbler',
    },
    {
        id: 15,
        parent: 1,
        key: 'raiseAndLowerableDesk',
        title: 'Höj- och sänkbart skrivbord',
    },
    {
        id: 16,
        parent: 1,
        key: 'officeChair',
        title: 'Kontorsstolar',
    },
    {
        id: 17,
        parent: 1,
        key: 'sparepart',
        title: 'Reservdelar och Tillbehör',
    },
    {
        id: 18,
        parent: 1,
        key: 'seatingFurniture',
        title: 'Sittmöbler',
    },
    {
        id: 19,
        parent: 1,
        key: 'desk',
        title: 'Skrivbord',
    },
    {
        id: 20,
        parent: 1,
        key: 'sofaAndBench',
        title: 'Soffor och Bänkar',
    },
    {
        id: 21,
        parent: 1,
        key: 'wanted',
        title: 'Sökes',
    },
    {
        id: 22,
        parent: 1,
        key: 'painting',
        title: 'Tavlor',
    },
    {
        id: 23,
        parent: 1,
        key: 'outdoorItem',
        title: 'UteÅterbrukat',
    },
    {
        id: 24,
        parent: 1,
        key: 'appliances',
        title: 'Vitvaror',
    },
    {
        id: 25,
        parent: 1,
        key: 'constructionMaterial',
        title: 'Återbygg',
    },
];

interface Category {
    id: number;
    parent: number | null;
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

export default sortCategories(categories);
