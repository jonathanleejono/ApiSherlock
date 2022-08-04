import jwt from "jsonwebtoken";
import { unAuthenticatedError } from "errors/index";
import { Request, Response, NextFunction } from "express";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    unAuthenticatedError(res, "Authentication Invalid");
    return;
  }

  const token = authHeader.split(" ")[1];

  interface JwtPayload {
    userId: string;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = { userId: payload.userId };

    next();
  } catch (error) {
    unAuthenticatedError(res, "Authentication Invalid");
    return;
  }
};

export default authenticateUser;