import categories from "../static/categories";

const getAllCategories = () => {
  return categories;
}

const getCategoriesByParent = (ids: [Number|null]) => {
  return categories.filter(category => ids.includes(category.parent));
}

const getCategoriesExceptByParent = (ids: [Number | null]) => {
  return categories.filter(category => !(ids.includes(category.parent) || ids.includes(category.id)));
}

const getCategoryByKey = (key: String) => {
  return categories.find(category => category.key === key);
}

export { getAllCategories, getCategoriesByParent, getCategoriesExceptByParent, getCategoryByKey };
