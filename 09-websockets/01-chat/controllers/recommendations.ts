import Product from '../models/Product';
import mapProduct from '../mappers/product';

export const recommendationsList = async function recommendationsList(
  ctx,
  next
) {
  const recommendations = await Product.find().limit(6);
  ctx.body = { recommendations: recommendations.map(mapProduct) };
};
