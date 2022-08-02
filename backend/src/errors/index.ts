import { Response } from "express";
import { StatusCodes } from "http-status-codes";

const badRequestError = (res: Response, msg: string) => {
  res.status(StatusCodes.BAD_REQUEST).json({ error: `${msg}` });
};

const unAuthenticatedError = (res: Response, msg: string) => {
  res.status(StatusCodes.UNAUTHORIZED).json({ error: `${msg}` });
};

const forbiddenError = (res: Response, msg: string) => {
  res.status(StatusCodes.FORBIDDEN).json({ error: `${msg}` });
};

const notFoundError = (res: Response, msg: string) => {
  res.status(StatusCodes.NOT_FOUND).json({ error: `${msg}` });
};

export { badRequestError, unAuthenticatedError, forbiddenError, notFoundError };
