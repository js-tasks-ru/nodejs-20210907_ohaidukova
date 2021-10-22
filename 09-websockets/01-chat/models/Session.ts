import mongoose, { Model, Document, ObjectId } from 'mongoose';
import connection from '../libs/connection';
import { IUserDocument } from './User';

export interface ISession {
  token: string;
  lastVisit: Date;
  user: ObjectId | IUserDocument;
}

export interface ISessionDocument extends ISession, Document {}

export interface ISessionModel extends Model<ISessionDocument> {}

const schema = new mongoose.Schema<ISessionDocument, ISessionModel, ISession>({
  token: {
    type: String,
    unique: true,
    required: true,
  },
  lastVisit: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

schema.path('lastVisit').index({ expires: '7d' });

export default connection.model<ISessionDocument, ISessionModel>(
  'Session',
  schema
);
