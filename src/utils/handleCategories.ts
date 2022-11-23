import { Category, allCategories } from '../static/categories';

const getCategoryByKey = (
    key: string | undefined | null,
): Category | undefined => {
    if (!key) {
        return undefined;
    }

    return allCategories.find(
        (category) => category.key === key || category.title === key,
    );
};

export { getCategoryByKey };
