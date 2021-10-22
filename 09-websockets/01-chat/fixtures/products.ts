import products from './data/products.json';

export default products.map((product) => ({
  ...product,
  price: parseInt(product.price),
  description: product.description.replace(/(<([^>]+)>)/gi, ''),
  rating: Math.floor(Math.random() * 2) + 3,
}));
