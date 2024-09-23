import { CallbackWithoutResultAndOptionalError, model, Schema } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../config';

const FullNameSchema = new Schema({
  firstName: {
    trim: true,
    type: String,
    required: [true, 'First name is required'],
    maxLength: [30, 'First name is too long'],
  },
  lastName: {
    trim: true,
    type: String,
    required: [true, 'Last name is required'],
    maxLength: [30, 'First name is too long'],
  },
});

const AddressSchema = new Schema({
  street: {
    trim: true,
    type: String,
    required: [true, 'Street is required'],
  },
  city: {
    trim: true,
    type: String,
    required: [true, 'City is required'],
  },
  country: {
    trim: true,
    type: String,
    required: [true, 'Country is required'],
  },
});

const OrderSchema = new Schema({
  productName: {
    trim: true,
    type: String,
    required: [true, 'Product name is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
  },
});

export const UserSchema = new Schema({
  userId: {
    type: Number,
    required: [true, 'User ID is required'],
    unique: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  fullName: {
    type: FullNameSchema,
    required: [true, 'Full name is required'],
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  hobbies: {
    type: [String],
    default: [],
  },
  address: {
    type: AddressSchema,
    required: [true, 'Address is required'],
  },
  orders: {
    type: [OrderSchema],
    default: [],
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: String,
    default: 'Admin',
  },
  dateModified: {
    type: Date,
    optional: true,
  },
  modifiedBy: {
    type: String,
    optional: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// * Pre save hook to hash password and capitalize first letter of first and last name
UserSchema.pre(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError) {
    this.fullName.firstName =
      this.fullName.firstName.charAt(0).toUpperCase() +
      this.fullName.firstName.slice(1).toLowerCase();
    this.fullName.lastName =
      this.fullName.lastName.charAt(0).toUpperCase() +
      this.fullName.lastName.slice(1).toLowerCase();

    this.password = await bcrypt.hash(this.password, config.bcrypt_salt_round);

    next();
  }
);

// * Post save hook to hide password
UserSchema.post(
  'save',
  function (doc: IUser, next: CallbackWithoutResultAndOptionalError) {
    console.log('A new user was created');
    doc.password = '********';
    next();
  }
);

// * Static method to check if user exists
UserSchema.statics.isUserExists = async function (
  userId?: number,
  username?: string
): Promise<boolean> {
  if (!userId && !username) {
    throw new Error('Either userId or username must be provided');
  }

  return await this.exists({ $or: [{ userId }, { username }] });
};

export const User = model<IUser, UserModel>('User', UserSchema);
