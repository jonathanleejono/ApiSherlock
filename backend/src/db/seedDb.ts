import { Request, Response } from "express";
import ApiCollection from "models/ApiCollection";
import UserCollection from "models/UserCollection";

import dotenv from "dotenv";
import { mockApis } from "mocks/mockApis";
import { mockUser } from "mocks/mockUser";
import { badRequestError, unAuthenticatedError } from "errors/index";
import validateUser from "middleware/validateUser";
dotenv.config();
// can also add dotenv validation packages

const resetUsersCollection = async (
  _: Request,
  res: Response
): Promise<void> => {
  if (process.env.NODE_ENV !== "testing") {
    badRequestError(res, "Can only seed db in testing");
    return;
  } else {
    await UserCollection.collection.drop();
    res.status(200).json({ msg: "DB reset!" });
  }
};

const resetApiCollection = async (_: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV !== "testing") {
    badRequestError(res, "Can only seed db in testing");
    return;
  } else {
    await ApiCollection.collection.drop();
    res.status(200).json({ msg: "DB reset!" });
  }
};

const { name, email, password } = mockUser;

const seedUsersCollection = async (
  _: Request,
  res: Response
): Promise<void> => {
  if (process.env.NODE_ENV !== "testing") {
    badRequestError(res, "Can only seed db in testing");
    return;
  } else {
    await UserCollection.create({ name, email, password });
    res.status(201).json({ msg: "DB seeded!" });
  }
};

const seedApiCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (process.env.NODE_ENV !== "testing") {
    badRequestError(res, "Can only seed db in testing");
    return;
  } else {
    try {
      const user = await validateUser(req, res);

      if (!user) {
        unAuthenticatedError(res, "Invalid Credentials");
        return;
      }

      Object.keys(mockApis).forEach(async (_, index: number) => {
        await ApiCollection.create({
          url: mockApis[index].url,
          host: mockApis[index].host,
          status: mockApis[index].status,
          lastPinged: mockApis[index].lastPinged,
          monitoring: mockApis[index].monitoring,
          createdBy: user._id,
        });
      });
      res.status(200).json({ msg: "DB seeded!" });
    } catch (error) {
      return error;
    }
  }
};

export {
  resetUsersCollection,
  resetApiCollection,
  seedUsersCollection,
  seedApiCollection,
};
