import * as handleCategories from './handleCategories';
import categories from "../static/categories";

describe('Categories helpers', () => {
  test('return all categories', () => {
    expect(handleCategories.getAllCategories()).toMatchObject(categories);
  });
  const id = 1;
  const categoriesFilteredByParent = categories.filter(category => category.parent === id);
  test('return categories by parent ids', () => {
    expect(handleCategories.getCategoriesByParent([id])).toMatchObject(categoriesFilteredByParent);
  });

  const categoriesExceptByParent = categories.filter(category => !(category.parent == id  || category.id == id));
  test('return categories except by parent ids', () => {
    expect(handleCategories.getCategoriesExceptByParent([id])).toMatchObject(categoriesExceptByParent);
  });

  const category = {
    id: 1,
    parent: null,
    key: "recycle",
    title: "Återbruk",
  };

  test('return category by key', () => {
    expect(handleCategories.getCategoryByKey('recycle')).toMatchObject(category);
  })
});
