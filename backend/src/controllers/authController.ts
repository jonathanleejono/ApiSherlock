import { JWT_ACCESS_TOKEN_LIFETIME } from "constants/envVars";
import { timezoneOffsets } from "constants/options/timezoneOffsets";
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
import {
  emptyValuesExist,
  validKeys,
  validValues,
} from "utils/validateKeysValues";

const register = async (req: Request, res: Response): Promise<void> => {
  if (
    !validKeys(
      res,
      Object.keys(req.body),
      `Invalid register, can only use: `,
      validRegisterKeys
    )
  )
    return;

  if (emptyValuesExist(res, Object.values(req.body))) return;

  const { email, timezoneGMT } = req.body;

  if (
    !validValues(
      res,
      timezoneGMT,
      `Invalid timezone, please select one of: `,
      timezoneOffsets
    )
  )
    return;

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
      `Invalid login, can only use: `,
      validLoginKeys
    )
  )
    return;

  if (emptyValuesExist(res, Object.values(req.body))) return;

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
      `Invalid update, can only update: `,
      validUpdateUserKeys
    )
  )
    return;

  // not all validUpdateUserKeys need to be present,
  // but if a key is present but the value is empty,
  // an error is returned
  if (emptyValuesExist(res, Object.values(req.body))) return;

  const { email, timezoneGMT } = req.body;

  if (
    timezoneGMT &&
    !validValues(
      res,
      timezoneGMT,
      `Invalid timezone, please select one of: `,
      timezoneOffsets
    )
  )
    return;

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
