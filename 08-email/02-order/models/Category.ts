import mongoose, { ObjectId, Document, Model } from 'mongoose';
import connection from '../libs/connection';

interface ISubcategory {
  title: string;
}

export interface ISubcategoryDocument extends ISubcategory, Document {}
export interface ISubcategoryModel extends Model<ISubcategoryDocument> {}

export interface ICategory extends ISubcategory {
  subcategories?: ISubcategory[];
}

export interface ICategoryDocument extends ICategory, Document {}
export interface ICategoryModel extends Model<ICategoryDocument> {}

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema<
  ICategoryDocument,
  ICategoryModel,
  ICategory
>({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
});

export default connection.model<ICategoryDocument, ICategoryModel>(
  'Category',
  categorySchema
);
