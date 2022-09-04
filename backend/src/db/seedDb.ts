import dotenv from "dotenv";
import { badRequestError, unAuthenticatedError } from "errors/index";
import { Request, Response } from "express";
import { mockApis } from "mocks/mockApis";
import { mockUser } from "mocks/mockUser";
import ApiCollection from "models/ApiCollection";
import MonitorCollection from "models/MonitorCollection";
import UserCollection from "models/UserCollection";
import validateUserExists from "utils/validateUserExists";

dotenv.config();

const TEST_ENV = process.env.NODE_ENV === "test";

const resetUsersCollection = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    if (!TEST_ENV) {
      badRequestError(res, "Can only seed db in testing");
      return;
    } else {
      await UserCollection.collection.drop();
      res.status(200).json({ msg: "DB reset!" });
    }
  } catch (error) {
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

const resetApiCollection = async (_: Request, res: Response): Promise<void> => {
  try {
    if (!TEST_ENV) {
      badRequestError(res, "Can only seed db in testing");
      return;
    } else {
      await ApiCollection.collection.drop();
      res.status(200).json({ msg: "DB reset!" });
    }
  } catch (error) {
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

const resetMonitorCollection = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    if (!TEST_ENV) {
      badRequestError(res, "Can only seed db in testing");
      return;
    } else {
      await MonitorCollection.collection.drop();
      res.status(200).json({ msg: "DB reset!" });
    }
  } catch (error) {
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

const seedUsersCollection = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    if (!TEST_ENV) {
      badRequestError(res, "Can only seed db in testing");
      return;
    } else {
      const user = new UserCollection(mockUser);
      await user.validate();
      await UserCollection.create(user);
      res.status(201).json({ msg: "DB seeded!" });
    }
  } catch (error) {
    console.log(error);
    badRequestError(res, error);
    return;
  }
};

const seedApiCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!TEST_ENV) {
    badRequestError(res, "Can only seed db in testing");
    return;
  } else {
    try {
      const user = await validateUserExists(req, res);

      if (!user) {
        unAuthenticatedError(res, "Invalid Credentials");
        return;
      }

      //eslint-disable-next-line
      const testApis: any = mockApis.map((api) => ({
        ...api,
        createdBy: user._id,
      }));

      await ApiCollection.insertMany(testApis);

      res.status(200).json({ msg: "DB seeded!" });
    } catch (error) {
      console.log(error);
      badRequestError(res, error);
      return;
    }
  }
};

export {
  resetUsersCollection,
  resetApiCollection,
  resetMonitorCollection,
  seedUsersCollection,
  seedApiCollection,
};
