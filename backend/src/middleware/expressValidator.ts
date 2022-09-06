import { registerUserUrl, updateUserUrl } from "constants/apiUrls";
import { NextFunction, Request, Response } from "express";
import { body, check, validationResult } from "express-validator";

export function createValidationFor(route: string) {
  switch (route) {
    case registerUserUrl:
      return [
        check("email").isEmail().withMessage("Please enter a valid email"),
        check("password")
          .isLength({ min: 6 })
          .withMessage("Please enter a password at least 6 characters long"),
      ];
    case updateUserUrl:
      return [
        body("email")
          .optional()
          .isEmail()
          .withMessage("Please enter a valid email"),
      ];
    default:
      return [];
  }
}

export function checkValidationResult(
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
