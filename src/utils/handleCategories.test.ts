import * as handleCategories from './handleCategories';

describe('Categories helpers', () => {
    const category = {
        id: 20,
        key: 'sofaAndBench',
        title: 'Soffor och Bänkar',
    };

    test('return category by key', () => {
        expect(handleCategories.getCategoryByKey('sofaAndBench')).toMatchObject(
            category,
        );
    });
});
