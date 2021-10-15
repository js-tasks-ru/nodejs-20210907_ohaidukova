import mongoose, { Model, Document } from 'mongoose';
import crypto from 'crypto';
import connection from '../libs/connection';
import config from '../config';

interface IUser {
  email: string;
  displayName: string;
  verificationToken?: string;
  passwordHash?: string;
  salt?: string;
}

export interface IUserDocument extends IUser, Document {
  setPassword: (password: string) => Promise<void>;
  checkPassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {}

const userSchema = new mongoose.Schema<IUserDocument, IUserModel, IUser>(
  {
    email: {
      type: String,
      required: [true, 'E-mail пользователя не должен быть пустым.'],
      validate: [
        {
          validator(value) {
            return /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value);
          },
          message: 'Некорректный email.',
        },
      ],
      unique: 'Такой email уже существует' as any,
    },
    displayName: {
      type: String,
      required: [true, 'У пользователя должно быть имя'],
      unique: 'Такое имя уже существует' as any,
    },
    verificationToken: {
      type: String,
      index: true,
    },
    passwordHash: {
      type: String,
    },
    salt: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

function generatePassword(salt: string, password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(
      password,
      salt,
      config.crypto.iterations,
      config.crypto.length,
      config.crypto.digest,
      (err, key) => {
        if (err) return reject(err);
        resolve(key.toString('hex'));
      }
    );
  });
}

function generateSalt(): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(config.crypto.length, (err, buffer) => {
      if (err) return reject(err);
      resolve(buffer.toString('hex'));
    });
  });
}

userSchema.methods.setPassword = async function setPassword(password: string) {
  this.salt = await generateSalt();
  this.passwordHash = await generatePassword(this.salt, password);
};

userSchema.methods.checkPassword = async function (
  password: string
): Promise<boolean> {
  if (!password) return false;

  const hash = await generatePassword(this.salt, password);
  return hash === this.passwordHash;
};

export default connection.model<IUserDocument, IUserModel>('User', userSchema);
