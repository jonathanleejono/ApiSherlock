import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function validateResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  const errors = result.array();

  const errMsg = errors[0].msg;

  res.status(400).json({ error: errMsg });
}
