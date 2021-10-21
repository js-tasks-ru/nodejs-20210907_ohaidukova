import categories from './data/categories.json';

export default Object.keys(categories).map((category) => ({
  title: category,
  subcategories: categories[category].map((subcategory) => ({
    title: subcategory,
  })),
}));
