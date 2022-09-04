import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

interface ErrorResponse {
  statusCode: number;
  message: string;
  name: string;
  errors: string[];
  code: number;
  keyValue: number;
}

const errorHandlerMiddleware = (
  err: ErrorResponse,
  _: Request,
  res: Response,
  next: NextFunction
) => {
  const defaultError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong, try again later",
  };
  if (err.name === "ValidationError") {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = Object.values(err.errors)
      //eslint-disable-next-line
      .map((item: any) => item.message)
      .join(",");
  }
  //duplicate key error
  if (err.code && err.code === 11000) {
    defaultError.statusCode = StatusCodes.BAD_REQUEST;
    defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`;
  }

  res.status(defaultError.statusCode).json({ msg: defaultError.msg });
  next();
  return;
};

export default errorHandlerMiddleware;
