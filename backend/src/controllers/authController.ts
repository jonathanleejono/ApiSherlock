import {
  cookieExpiryTime,
  cookieHttpOnlySetting,
  cookieName,
  cookieSameSiteSetting,
  cookieSecureSetting,
} from "constants/cookies";
import { timezoneOffsets } from "constants/options/timezoneOffsets";
import {
  validLoginKeys,
  validRegisterKeys,
  validUpdateUserKeys,
} from "constants/options/user";
import dotenv from "dotenv";
import { badRequestError, unAuthenticatedError } from "errors/index";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "interfaces/jwtPayload";
import jwt from "jsonwebtoken";
import UserCollection from "models/UserCollection";
import {
  emptyValuesExist,
  validKeys,
  validValues,
} from "utils/validateKeysValues";
import validateUserExists from "utils/validateUserExists";

dotenv.config();

const { JWT_ACCESS_TOKEN_LIFETIME, JWT_REFRESH_TOKEN_LIFETIME } = process.env;

const register = async (req: Request, res: Response): Promise<void> => {
  try {
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

    const refreshToken = user.createJWT(JWT_REFRESH_TOKEN_LIFETIME as string);

    res
      .cookie(cookieName, refreshToken, {
        //use maxAge, not "expires"
        maxAge: cookieExpiryTime, // expires in a day
        secure: cookieSecureSetting,
        httpOnly: cookieHttpOnlySetting,
        sameSite: cookieSameSiteSetting,
      })
      .status(StatusCodes.CREATED)
      .json({
        user: {
          email: user.email,
          name: user.name,
          timezoneGMT: user.timezoneGMT,
        },
        accessToken,
      });
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
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

    const isPasswordCorrect = await user.comparePassword(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      unAuthenticatedError(res, "Incorrect Credentials");
      return;
    }

    const accessToken = user.createJWT(JWT_ACCESS_TOKEN_LIFETIME as string);

    const refreshToken = user.createJWT(JWT_REFRESH_TOKEN_LIFETIME as string);

    user.password = "";

    //cookie needs to come before status and json are set
    res
      .cookie(cookieName, refreshToken, {
        //use maxAge, not "expires"
        maxAge: cookieExpiryTime, // expires in a day
        secure: cookieSecureSetting,
        httpOnly: cookieHttpOnlySetting,
        sameSite: cookieSameSiteSetting,
      })
      .status(StatusCodes.OK)
      .json({
        user: {
          email: user.email,
          name: user.name,
          timezoneGMT: user.timezoneGMT,
        },
        accessToken,
      });
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await validateUserExists(req, res);

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

    const accessToken = user.createJWT(JWT_ACCESS_TOKEN_LIFETIME as string);

    const refreshToken = user.createJWT(JWT_REFRESH_TOKEN_LIFETIME as string);

    res
      .cookie(cookieName, refreshToken, {
        //use maxAge, not "expires"
        maxAge: cookieExpiryTime, // expires in a day
        secure: cookieSecureSetting,
        httpOnly: cookieHttpOnlySetting,
        sameSite: cookieSameSiteSetting,
      })
      .status(StatusCodes.OK)
      .json({
        user: {
          email: user.email,
          name: user.name,
          timezoneGMT: user.timezoneGMT,
        },
        accessToken,
      });
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

const refreshAccessToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.cookies) {
      badRequestError(res, "Cookies missing");
      return;
    }

    const refreshToken = req.cookies[cookieName];

    if (!refreshToken) {
      unAuthenticatedError(res, "Invalid credentials, please login again");
      return;
    }

    let payload: JwtPayload;

    try {
      payload = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET as string
      ) as JwtPayload;
    } catch (error) {
      unAuthenticatedError(res, "Please login again");
      return;
    }

    const user = await UserCollection.findOne({ _id: payload.userId });

    if (!user) {
      unAuthenticatedError(res, "Invalid user credentials");
      return;
    }

    const newAccessToken = user.createJWT(JWT_ACCESS_TOKEN_LIFETIME as string);

    res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
  } catch (error) {
    badRequestError(res, error);
    return;
  }
};

export { register, login, updateUser, refreshAccessToken };
