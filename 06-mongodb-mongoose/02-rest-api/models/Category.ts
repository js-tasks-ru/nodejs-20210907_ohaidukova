import mongoose from 'mongoose';
import connection from '../libs/connection';

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

export const SubCategory = connection.model('SubCategory', subCategorySchema);

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
});

export default connection.model('Category', categorySchema);
