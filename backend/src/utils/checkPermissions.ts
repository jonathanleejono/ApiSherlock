import { unAuthenticatedError } from "errors/index";
import { Response } from "express";
import { Schema } from "mongoose";

const checkPermissions = (
  res: Response,
  requestUserId: Schema.Types.ObjectId,
  resourceUserId: Schema.Types.ObjectId
) => {
  if (requestUserId.toString() !== resourceUserId.toString()) {
    unAuthenticatedError(res, "Not authorized to access");
    return;
  } else return;
};

export default checkPermissions;
