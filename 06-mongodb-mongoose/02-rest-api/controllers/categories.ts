import Category from '../models/Category';
import { IItem } from '../interfaces';

export interface ICategoryResponse extends IItem {
  subcategories: IItem[];
}

interface IMappedItem extends Omit<IItem, '_id'> {
  id: string;
}

interface ICategory extends IMappedItem {
  subcategories: IMappedItem[];
}

export const categoryList = async function categoryList(ctx, next) {
  const categories: ICategoryResponse[] = await Category.find({});

  const response: ICategory[] = categories.map((category) => ({
    id: category._id,
    title: category.title,
    subcategories: category.subcategories
      ? category.subcategories.map((subcategory) => ({
          id: subcategory._id,
          title: subcategory.title,
        }))
      : null,
  }));

  ctx.body = {
    categories: response,
  };
};
