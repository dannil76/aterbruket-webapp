import { Category, allCategories } from '../static/categories';

const getCategoryByKey = (key: string): Category | undefined => {
    return allCategories.find((category) => category.key === key);
};

export { getCategoryByKey };
