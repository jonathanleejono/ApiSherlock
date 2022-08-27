import { unAuthenticatedError } from "errors/index";
import { Types } from "mongoose";
import { Response } from "express";

const checkPermissions = (
  res: Response,
  requestUserId: Types.ObjectId,
  resourceUserId: Types.ObjectId
) => {
  if (requestUserId.toString() !== resourceUserId.toString()) {
    unAuthenticatedError(res, "Not authorized to access");
    return;
  } else return;
};

export default checkPermissions;
