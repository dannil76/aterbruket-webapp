import { IOption } from "../interfaces/IForm";

const minCommonCategory = (obj: any) => {
  let maxValue = Infinity as any;
  let maxKey = "";

  Object.entries(obj).forEach((entry) => {
    const [key, value] = entry;

    if (obj[key] < maxValue) {
      maxValue = value;
      maxKey = key;
    }
  });
  return { min: maxKey, minNum: maxValue };
};

const mostCommonCategory = (obj: any) => {
  let maxValue = 0 as any;
  let maxKey = "";

  Object.entries(obj).forEach((entry) => {
    const [key, value] = entry;

    if (obj[key] > maxValue) {
      maxValue = value;
      maxKey = key;
    }
  });
  return { most: maxKey, mostNum: maxValue };
};

type Amount = {
  [key: string]: number;
};

const translate = (items: Amount, categories: IOption[]) => {
  const newItems = <Amount>{};

  Object.entries(items).forEach(([key, val]) => {
    const categoryObject = categories.find((c) => c.key === key);
    newItems[categoryObject?.title ? categoryObject.title : key] = val;
  });

  return newItems;
};

const CountingCategorys = (groups: any, categories: IOption[]) => {
  groups.forEach((group: any) => {
    const categoryAmounts = <Amount>{};

    const eachGroup = group;
    const itemsInGroup = eachGroup.items;

    itemsInGroup.forEach((i: Amount) => {
      if (i.category in categoryAmounts) {
        categoryAmounts[i.category] += 1;
      } else {
        categoryAmounts[i.category] = 1;
      }
    });
    eachGroup.categoryAmount = translate(categoryAmounts, categories);

    const mostComon = mostCommonCategory(categoryAmounts);
    const minComon = minCommonCategory(categoryAmounts);

    eachGroup.min = minComon.min;
    eachGroup.minNum = minComon.minNum;
    eachGroup.most = mostComon.most;
    eachGroup.mostNum = mostComon.mostNum;
  });

  return groups;
};

export default CountingCategorys;
