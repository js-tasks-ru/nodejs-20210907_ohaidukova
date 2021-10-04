import Product from '../models/Product';
import { ValidationError, NotFoundError } from '../errors.ts';
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

const idRegexp = /.{24}/;

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

export const productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  const products: IProductResponse[] = await Product.find({
    subcategory: subcategory,
  });

  ctx.body = {
    products: products.map((product) => mappingProduct(product)),
  };
};

export const productList = async function productList(ctx, next) {
  const products: IProductResponse[] = await Product.find({});
  ctx.body = {
    products: products.map((product) => mappingProduct(product)),
  };
};

export const productById = async function productById(ctx, next) {
  if (!idRegexp.test(ctx.params.id))
    throw new ValidationError({ message: 'ID is not correct', code: 400 });

  const product = await Product.findById(ctx.params.id);
  if (!product) throw new NotFoundError({ message: 'Not found', code: 404 });

  ctx.body = {
    product: mappingProduct(product),
  };
};
