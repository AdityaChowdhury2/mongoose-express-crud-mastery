import { ApiResponse } from '../../shared/models/ApiResponse';
import { IUser } from './user.interface';
import { User } from './user.model';

/**
 * Creates a new user.
 *
 * @param {IUser} user - The user data to be created.
 * @returns {Promise<ApiResponse<IUser>>} - The response object with the status and data.
 */
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
      message: 'User created successfully',
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

/**
 * Gets all users.
 *
 * @returns {Promise<ApiResponse<IUser[]>>} - The response object with the status and data.
 */
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
      message: 'Users fetched successfully!',
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

/**
 * Gets a user by user ID.
 *
 * @param {number} userId - The user ID to be fetched.
 * @returns {Promise<ApiResponse<IUser>>} - The response object with the status and data.
 */
const getUserByUserId = async (userId: number): Promise<ApiResponse<IUser>> => {
  try {
    const isUserExists = await User.isUserExists(userId);
    if (!isUserExists) {
      return {
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          message: 'User not found',
        },
      };
    }
    const user = (await User.findOne({ userId }).exec()) as IUser;
    return {
      success: true,
      message: 'User fetched successfully!',
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong',
      error,
    };
  }
};

/**
 * Updates a user by user ID.
 *
 * @param {number} userId - The user ID to be updated.
 * @param {IUser} user - The user data to be updated.
 * @returns {Promise<ApiResponse<IUser>>} - The response object with the status and data.
 * */

const updateUserById = async (
  userId: number,
  user: IUser
): Promise<ApiResponse<IUser>> => {
  try {
    const isUserExists = await User.isUserExists(userId);
    if (!isUserExists) {
      return {
        success: false,
        message: 'User not found',
        error: {
          code: 404,
          message: 'User not found',
        },
      };
    }
    const response = (await User.findOneAndUpdate(
      { userId },
      user
    ).exec()) as IUser;
    return {
      success: true,
      message: 'User updated successfully!',
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

export const UserService = {
  getUsers,
  createUser,
  getUserByUserId,
  updateUserById,
};
