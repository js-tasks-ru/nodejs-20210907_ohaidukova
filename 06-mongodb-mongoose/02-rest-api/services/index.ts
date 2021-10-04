import Category, { SubCategory } from '../models/Category';
import Product from '../models/Product';

export async function fillDB() {
  /* create SubCategory */
  //   await SubCategory.create({
  //     title: 'toys',
  //   });
  //   const subcat = await SubCategory.find({ title: 'toys' });
  //   console.log(subcat);
  //
  /* create Category */
  //   await Category.create({
  //     title: 'kids',
  //     subcategories: [
  //       {
  //         title: 'toys',
  //       },
  //       {
  //         title: 'clothes',
  //       },
  //     ],
  //   });
  //
  /* create Product */
  //   await Product.create({
  //     title: 'Train',
  //     images: ['image'],
  //     category: '6159bcbf971fc31554dd2539',
  //     subcategory: '6159bcbf971fc31554dd253a',
  //     price: 1000,
  //     description: 'Wonderful toys',
  //   });
}
