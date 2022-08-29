import {
  cookieExpiryTime,
  cookieHttpOnlySetting,
  cookieName,
  cookieSameSiteSetting,
  cookieSecureSetting,
} from "constants/cookies";
import {
  validLoginKeys,
  validRegisterKeys,
  validUpdateKeys,
} from "constants/keys";
import { timezoneOffsets } from "constants/timezoneOffsets";
import dotenv from "dotenv";
import { badRequestError, unAuthenticatedError } from "errors/index";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { JwtPayload } from "interfaces/jwtPayload";
import jwt from "jsonwebtoken";
import UserCollection from "models/UserCollection";
import { validKeys } from "utils/validateKeys";
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

    const { name, email, password, timezoneGMT } = req.body;

    if (!name || !email || !password) {
      badRequestError(res, "Please provide all values");
      return;
    }

    if (!timezoneOffsets.includes(timezoneGMT)) {
      badRequestError(
        res,
        `Invalid timezone, please select one of: ${timezoneOffsets}`
      );
      return;
    }

    const emailAlreadyExists = await UserCollection.findOne({ email });

    if (emailAlreadyExists) {
      badRequestError(res, "Please use a different email");
      return;
    }

    const user = await UserCollection.create({
      name,
      email,
      password,
      timezoneGMT,
    });

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
    console.log(error);
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

    const { email, password } = req.body;

    if (!email || !password) {
      badRequestError(res, "Please provide all values");
      return;
    }

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
    console.log(error);
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
        validUpdateKeys
      )
    )
      return;

    const { email, name, timezoneGMT } = req.body;

    if (!email || !name || !timezoneGMT) {
      badRequestError(res, "Please provide all values");
      return;
    }

    if (!timezoneOffsets.includes(timezoneGMT)) {
      badRequestError(
        res,
        `Invalid timezone, please select one of: ${timezoneOffsets}`
      );
      return;
    }

    if (user.email !== email) {
      const emailAlreadyExists = await UserCollection.findOne({ email });
      if (emailAlreadyExists) {
        badRequestError(res, "Please use a different email");
        return;
      }
    }

    user.email = email;
    user.name = name;
    user.timezoneGMT = timezoneGMT;

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
    console.log(error);
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
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

export { register, login, updateUser, refreshAccessToken };
