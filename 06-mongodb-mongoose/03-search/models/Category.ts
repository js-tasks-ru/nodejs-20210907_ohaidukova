import mongoose from 'mongoose';
import connection from '../libs/connection';

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
});

export default connection.model('Category', categorySchema);
