import { Request, Response } from "express";
import Api from "../models/ApiCollection";
import User from "../models/UserCollection";

import dotenv from "dotenv";
import { mockApis } from "../mocks/mockApis";
import { mockUser } from "../mocks/mockUser";
dotenv.config();
// can also add dotenv validation packages

const resetUsersCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (process.env.NODE_ENV !== "testing") {
    res.status(400).json({ error: "Can only seed db in testing" });
  } else {
    await User.collection.drop();
    res.status(200).json({ msg: "DB reset!" });
  }
};

const resetApiCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (process.env.NODE_ENV !== "testing") {
    res.status(400).json({ error: "Can only seed db in testing" });
  } else {
    await Api.collection.drop();
    res.status(200).json({ msg: "DB reset!" });
  }
};

const { name, email, password } = mockUser;

const seedUsersCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (process.env.NODE_ENV !== "testing") {
    res.status(400).json({ error: "Can only seed db in testing" });
  } else {
    await User.create({ name, email, password });
    res.status(201).json({ msg: "DB seeded!" });
  }
};

const seedApiCollection = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (process.env.NODE_ENV !== "testing") {
    res.status(400).json({ error: "Can only seed db in testing" });
  } else {
    try {
      Object.keys(mockApis).forEach(async (api) => {
        await Api.create({
          url: mockApis[api].url,
          host: mockApis[api].host,
          status: mockApis[api].status,
          lastPinged: mockApis[api].lastPinged,
          monitoring: mockApis[api].monitoring,
          createdBy: req?.user?.userId,
        });
      });
      res.status(200).json({ msg: "DB seeded!" });
    } catch (error) {
      console.log("error: ", error);
    }
  }
};

export {
  resetUsersCollection,
  resetApiCollection,
  seedUsersCollection,
  seedApiCollection,
};
