import mongoose, { ObjectId, Document, Model } from 'mongoose';
import connection from '../libs/connection';

export interface IOrder {
  user: ObjectId;
  product: ObjectId;
  phone: string;
  address: string;
}

export interface IOrderDocument extends IOrder, Document {}
export interface IOrderModel extends Model<IOrderDocument> {}

const orderSchema = new mongoose.Schema<IOrderDocument, IOrderModel, IOrder>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  phone: {
    type: String,
    required: true,
    validate: [
      {
        validator(value) {
          return /\+?\d{6,14}/.test(value);
        },
        message: 'Неверный формат номера телефона.',
      },
    ],
  },
  address: {
    type: String,
    required: true,
  },
});

export default connection.model<IOrderDocument, IOrderModel>(
  'Order',
  orderSchema
);
