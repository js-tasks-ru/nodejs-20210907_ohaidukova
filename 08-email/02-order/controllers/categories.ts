import Category from '../models/Category';
import mapCategory from '../mappers/category';

export const categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find();
  ctx.body = { categories: categories.map(mapCategory) };
};
