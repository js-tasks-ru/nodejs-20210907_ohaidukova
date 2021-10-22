import mongoose, { ObjectId, Document, Model } from 'mongoose';
import connection from '../libs/connection';

export interface IProduct {
  title: string;
  description: string;
  price: number;
  category: ObjectId;
  subcategory: ObjectId;
  images?: string[];
}

export interface IProductDocument extends IProduct, Document {}
export interface IProductModel extends Model<IProductDocument> {}

const productSchema = new mongoose.Schema<
  IProductDocument,
  IProductModel,
  IProduct
>({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },

  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  images: [String],
});

export default connection.model<IProductDocument, IProductModel>(
  'Product',
  productSchema
);