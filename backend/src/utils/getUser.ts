import { unAuthenticatedError } from "errors";
import { Request, Response } from "express";
import UserCollection from "models/UserCollection";

const getUser = async (req: Request, res: Response) => {
  if (!req.user) {
    unAuthenticatedError(res, "Missing user");
    return;
  }

  if (!req.user.userId) {
    unAuthenticatedError(res, "Missing user id");
    return;
  }

  const user = await UserCollection.findOne({ _id: req.user.userId });

  if (!user) {
    unAuthenticatedError(res, "User not found!");
    return;
  }

  return user;
};

export default getUser;
