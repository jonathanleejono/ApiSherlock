import User from "../models/UserCollection";
import { Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();
// can also add dotenv validation packages

const resetDb = async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV !== "testing") {
    res.status(400).json({ error: "Can only seed db in testing" });
  } else {
    await User.collection.drop();
    res.status(200).json({ msg: "DB reset!" });
  }
};

export const seedUser = {
  name: "jane",
  email: "janedoe1@gmail.com",
  password: "password",
};

const { name, email, password } = seedUser;

const seedDb = async (req: Request, res: Response): Promise<void> => {
  if (process.env.NODE_ENV !== "testing") {
    res.status(400).json({ error: "Can only seed db in testing" });
  } else {
    await User.create({ name, email, password });
    res.status(200).json({ msg: "DB seeded!" });
  }
};

export { resetDb, seedDb };
