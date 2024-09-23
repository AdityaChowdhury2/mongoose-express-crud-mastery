import { ApiResponse } from '../../shared/models/ApiResponse';
import { IUser } from './user.interface';
import { User } from './user.model';

const createUser = async (user: IUser): Promise<ApiResponse<IUser>> => {
  try {
    if (await User.isUserExists(user.userId, user.username)) {
      return {
        success: false,
        message: 'User already exists',
      };
    }
    const response = await User.create(user);

    return {
      success: true,
      message: 'User created',
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong',
      error,
    };
  }
};

const getUsers = async (): Promise<ApiResponse<IUser[]>> => {
  try {
    const users = await User.find().exec();
    console.log(users);
    if (users.length === 0) {
      return {
        success: false,
        message: 'No users found',
      };
    }
    return {
      success: true,
      message: 'Users found',
      data: users,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong',
      error,
    };
  }
};

export const UserService = {
  getUsers,
  createUser,
};
