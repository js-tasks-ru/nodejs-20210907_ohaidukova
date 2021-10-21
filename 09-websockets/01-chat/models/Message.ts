import mongoose, { ObjectId, Document, Model } from 'mongoose';
import connection from '../libs/connection';

export interface IMessage {
  user: string;
  chat: ObjectId;
  text: string;
  date: Date;
}

export interface IMessageDocument extends IMessage, Document {}
export interface IMessageModel extends Model<IMessageDocument> {}

const messageSchema = new mongoose.Schema<
  IMessageDocument,
  IMessageModel,
  IMessage
>({
  user: {
    type: String,
    required: true,
  },

  chat: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    required: true,
  },
});

export default connection.model<IMessageDocument, IMessageModel>(
  'Message',
  messageSchema
);
