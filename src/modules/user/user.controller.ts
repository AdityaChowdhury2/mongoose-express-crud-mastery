import { Request, Response } from 'express';
import { UserService } from './user.service';
import { OrderValidationSchema, UserValidationSchema } from './user.validation';
import { IOrder, IUser } from './user.interface';
import { ApiResponse } from '../../shared/models/ApiResponse';

/**
 * Creates a new user.
 *
 * @param {Request} req - The request object, containing the user data in the body.
 * @param {Response} res - The response object, used to send the response back to the client.
 * @returns {Promise<Response>} - The response object with the status and data.
 */
const createUser = async (req: Request, res: Response) => {
  try {
    const { user: UserData } = req.body;
    console.log(UserData);

    const zodParsedUser = UserValidationSchema.parse(UserData);
    console.log('zodParsedUser', zodParsedUser);
    const response: ApiResponse<IUser> = await UserService.createUser(
      zodParsedUser as IUser
    );
    if (!response.success) {
      return res.status(400).send(response);
    } else {
      return res.status(201).send(response);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};

/**
 * Gets all users.
 *
 * @param {Request} req - The request object, containing the user data in the body.
 * @param {Response} res - The response object, used to send the response back to the client.
 * @returns {Promise<Response>} - The response object with the status and data.
 */
const getUsers = async (req: Request, res: Response) => {
  try {
    const response = await UserService.getUsers();
    if (!response.success) {
      return res.status(404).send(response);
    } else {
      return res.status(200).send(response);
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};

/**
 * Gets a user by user ID.
 *
 * @param {Request} req - The request object, containing the user ID in the params.
 * @param {Response} res - The response object, used to send the response back to the client.
 * @returns {Promise<Response>} - The response object with the status and data.
 */
const getUserByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const response = await UserService.getUserByUserId(Number(userId));
    if (!response.success) {
      return res.status(404).send(response);
    } else {
      return res.status(200).send(response);
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};

const updateUserByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { user: UserData } = req.body;
  try {
    const zodParsedUser = UserValidationSchema.parse(UserData);
    const response = await UserService.updateUserById(
      Number(userId),
      zodParsedUser as IUser
    );
    if (!response.success) {
      return res.status(404).send(response);
    } else {
      return res.status(200).send(response);
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};

const addNewProductInOrder = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { order: OrderData } = req.body;

  try {
    const zodParsedOrder = OrderValidationSchema.parse(OrderData);
    const response = await UserService.addNewProductInOrder(
      Number(userId),
      zodParsedOrder as IOrder
    );
    if (!response.success) {
      return res.status(404).send(response);
    } else {
      return res.status(200).send(response);
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: 'Something went wrong',
      error,
    });
  }
};

export const UserController = {
  getUsers,
  createUser,
  getUserByUserId,
  updateUserByUserId,
  addNewProductInOrder,
};
