import { JWT_ACCESS_TOKEN_LIFETIME } from "constants/envVars";
import {
  validLoginKeys,
  validRegisterKeys,
  validUpdateUserKeys,
} from "constants/options/user";
import { badRequestError, unAuthenticatedError } from "errors/index";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import UserCollection from "models/UserCollection";
import getUser from "utils/getUser";
import { validKeys } from "utils/validateKeysValues";

const register = async (req: Request, res: Response): Promise<void> => {
  if (
    !validKeys(
      res,
      Object.keys(req.body),
      `Invalid register, can only input: `,
      validRegisterKeys
    )
  )
    return;

  const { email } = req.body;

  const emailAlreadyExists = await UserCollection.findOne({ email });

  if (emailAlreadyExists) {
    badRequestError(res, "Please use a different email");
    return;
  }
  const user = new UserCollection(req.body);

  await user.validate();

  await UserCollection.create(user);

  const accessToken = user.createJWT(JWT_ACCESS_TOKEN_LIFETIME as string);

  res.status(StatusCodes.CREATED).json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      timezoneGMT: user.timezoneGMT,
    },
    accessToken,
  });
};

const login = async (req: Request, res: Response): Promise<void> => {
  if (
    !validKeys(
      res,
      Object.keys(req.body),
      `Invalid login, can only input: `,
      validLoginKeys
    )
  )
    return;

  const { email, password } = req.body;

  const user = await UserCollection.findOne({ email }).select("+password");

  if (!user) {
    unAuthenticatedError(res, "Invalid Credentials");
    return;
  }

  const isPasswordCorrect = await user.comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    unAuthenticatedError(res, "Incorrect Credentials");
    return;
  }

  const accessToken = user.createJWT(JWT_ACCESS_TOKEN_LIFETIME as string);

  user.password = "";

  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      timezoneGMT: user.timezoneGMT,
    },
    accessToken,
  });
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req, res);

  if (!user) {
    unAuthenticatedError(res, "Invalid Credentials");
    return;
  }

  if (
    !validKeys(
      res,
      Object.keys(req.body),
      `Invalid update profile, can only input: `,
      validUpdateUserKeys
    )
  )
    return;

  const { email } = req.body;

  if (email && user.email !== email) {
    const emailAlreadyExists = await UserCollection.findOne({ email });
    if (emailAlreadyExists) {
      badRequestError(res, "Please use a different email");
      return;
    }
  }

  Object.assign(user, req.body);

  await user.validate();

  await user.save();

  user.password = "";

  const accessToken = user.createJWT(JWT_ACCESS_TOKEN_LIFETIME as string);

  res.status(StatusCodes.OK).json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      timezoneGMT: user.timezoneGMT,
    },
    accessToken,
  });
};

const getAuthUser = async (req: Request, res: Response): Promise<void> => {
  const user = await getUser(req, res);

  if (!user) {
    unAuthenticatedError(res, "User not found!");
    return;
  }

  res.status(StatusCodes.OK).json({
    id: user._id,
    name: user.name,
    email: user.email,
    timezoneGMT: user.timezoneGMT,
  });
};

export { register, login, updateUser, getAuthUser };
