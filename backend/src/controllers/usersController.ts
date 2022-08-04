import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { badRequestError, unAuthenticatedError } from "errors/index";
import UserCollection from "models/UserCollection";
import validateUser from "middleware/validateUser";
import { validateInputKeys } from "middleware/validateKeys";
import {
  validRegisterKeys,
  validLoginKeys,
  validUpdateKeys,
} from "constants/keys";

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    validateInputKeys(
      req,
      res,
      `Invalid register, can only use: `,
      validRegisterKeys
    );

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      badRequestError(res, "Please provide all values");
      return;
    }

    const userAlreadyExists = await UserCollection.findOne({ email });

    if (userAlreadyExists) {
      badRequestError(res, "Please use a different email");
      return;
    }

    const user = await UserCollection.create({ name, email, password });

    const token = user.createJWT();

    res.status(StatusCodes.CREATED).json({
      user: {
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    return error;
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    validateInputKeys(
      req,
      res,
      `Invalid login, can only use: `,
      validLoginKeys
    );

    const { email, password } = req.body;

    if (!email || !password) {
      badRequestError(res, "Please provide all values");
      return;
    }

    const user = await UserCollection.findOne({ email }).select("+password");

    if (!user || !user.password) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const isPasswordCorrect = await user.comparePassword(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    const token = user.createJWT();

    user.password = "";

    res.status(StatusCodes.OK).json({
      user: {
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    return error;
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUser(req, res);

    if (!user) {
      unAuthenticatedError(res, "Invalid Credentials");
      return;
    }

    validateInputKeys(
      req,
      res,
      `Invalid update, can only update: `,
      validUpdateKeys
    );

    const { email, name } = req.body;

    if (!email || !name) {
      badRequestError(res, "Please provide all values");
      return;
    }

    user.email = email;
    user.name = name;

    await user.save();

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({
      user: {
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    return error;
  }
};

export { register, login, updateUser };
