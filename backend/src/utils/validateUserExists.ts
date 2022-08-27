import { unAuthenticatedError } from "errors";
import { Request, Response } from "express";
import UserCollection from "models/UserCollection";

const validateUserExists = async (req: Request, res: Response) => {
  if (!req.user) {
    unAuthenticatedError(res, "Unauthenticated action");
    return;
  }
  const { userId } = req.user;

  if (!userId) {
    unAuthenticatedError(res, "Unauthenticated action");
    return;
  }

  // the select -__v removes the "__v" value from being returned
  const user = await UserCollection.findOne({ _id: userId }).select("-__v");

  if (!user) {
    unAuthenticatedError(res, "Unauthenticated action");
    return;
  }

  return user;
};

export default validateUserExists;
