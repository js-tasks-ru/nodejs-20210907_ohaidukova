import Product from '../models/Product';
import mongoose from 'mongoose';
import mapProduct from '../mappers/product';

export const productsBySubcategory = async function productsBySubcategory(
  ctx,
  next
) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  const products = await Product.find({ subcategory: subcategory }).limit(20);
  ctx.body = { products: products.map(mapProduct) };
};

export const productsByQuery = async function productsByQuery(ctx, next) {
  const { query } = ctx.query;
  if (!query) return next();
  const products = await Product.find(
    { $text: { $search: query } },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);
  ctx.body = { products: products.map(mapProduct) };
};

export const productList = async function productList(ctx, next) {
  const products = await Product.find().limit(20);
  ctx.body = { products: products.map(mapProduct) };
};

export const productById = async function productById(ctx, next) {
  if (!mongoose.Types.ObjectId.isValid(ctx.params.id)) {
    ctx.throw(400, 'invalid product id');
  }

  const product = await Product.findById(ctx.params.id);

  if (!product) {
    ctx.throw(404, `no product with ${ctx.params.id} id`);
  }

  ctx.body = { product: mapProduct(product) };
};
