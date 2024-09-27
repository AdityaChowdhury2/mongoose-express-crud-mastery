import { Model } from 'mongoose';

export interface IUser extends Document {
  userId: number;
  username: string;
  password: string;
  fullName: IFullName;
  age: number;
  email: string;
  isActive: boolean;
  hobbies: string[];
  address: IAddress;
  orders: IOrder[];
  dateCreated: Date;
  createdBy: string;
  dateModified?: Date;
  modifiedBy?: string;
  isDeleted?: boolean;
}

export interface IFullName {
  firstName: string;
  lastName: string;
}

export interface IAddress {
  street: string;
  city: string;
  country: string;
}

export interface IOrder {
  productName: string;
  price: number;
  quantity: number;
}

// * This interface is used to define the static methods of the User model
export interface UserModel extends Model<IUser> {
  isUserExists: (userId?: number, username?: string) => Promise<boolean>;
}
