import { Request, Response } from 'express';
import { UserService } from './user.service';
import { UserValidationSchema } from './user.validation';
import { IUser } from './user.interface';
import { ApiResponse } from '../../shared/models/ApiResponse';

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

export const UserController = {
  getUsers,
  createUser,
  getUserByUserId,
};
