import Product from '../models/Product';
import { IItem } from '../interfaces';

export interface IProductResponse extends IItem {
  images: string[];
  category: string;
  subcategory: string;
  price: number;
  description: string;
}

interface IProduct extends Omit<IProductResponse, '_id'> {
  id: string;
}

const mappingProduct = (product: IProductResponse) => {
  const {
    _id: id,
    title,
    images,
    category,
    subcategory,
    price,
    description,
  } = product;
  return {
    id,
    title,
    images,
    category,
    subcategory,
    price,
    description,
  };
};

export const productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;

  console.log(query);

  const products: IProductResponse[] = await Product.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  ).sort({ score: { $meta: 'textScore' } });

  ctx.body = {
    products: products.map((product) => mappingProduct(product)),
  };
};
