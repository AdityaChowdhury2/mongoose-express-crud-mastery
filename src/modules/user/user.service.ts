import { ApiResponse } from '../../shared/models/ApiResponse';
import { IOrder, IUser } from './user.interface';
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

/**
 * Adds a new product in the user's order.
 *
 * @param {number} userId - The user ID to add the order to.
 * @param {IOrder} orderData - The order data to be added.
 * @returns {Promise<ApiResponse<null>>} - The response object with the status and data.
 */

const addNewProductInOrder = async (
  userId: number,
  orderData: IOrder
): Promise<ApiResponse<null>> => {
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
    } else {
      await User.findOneAndUpdate(
        {
          userId: userId,
        },
        {
          $push: { orders: orderData },
        },
        {
          new: true,
          upsert: false,
          runValidators: true,
        }
      ).exec();

      return {
        success: true,
        message: 'Order added successfully',
        data: null,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong',
      error,
    };
  }
};

/**
 * Gets the total price of all orders by user ID.
 *
 * @param {number} userId - The user ID to get the total price of all orders.
 * @returns {Promise<ApiResponse<{ totalPrice: number }>>} - The response object with the status and data.
 */
const getAllOrdersByUserId = async (
  userId: number
): Promise<ApiResponse<{ orders: IOrder[] }>> => {
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
    } else {
      const user = (await User.findOne({ userId }).exec()) as IUser;

      return {
        success: true,
        message: 'Orders fetched successfully',
        data: { orders: user.orders },
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Something went wrong',
      error,
    };
  }
};

/**
 * Gets the total price of all orders by user ID.
 *
 * @param {number} userId - The user ID to get the total price of all orders.
 * @returns {Promise<ApiResponse<{ totalPrice: number }>>} - The response object with the status and data.
 */
const getTotalPriceOfAllOrdersByUserId = async (
  userId: number
): Promise<ApiResponse<{ totalPrice: number }>> => {
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
    } else {
      const user = (await User.findOne({ userId }).exec()) as IUser;
      const totalPrice = user.orders.reduce(
        (acc, order) => acc + order.price,
        0
      );
      return {
        success: true,
        message: 'Total price fetched successfully',
        data: { totalPrice },
      };
    }
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
  addNewProductInOrder,
  getAllOrdersByUserId,
  getTotalPriceOfAllOrdersByUserId,
};
