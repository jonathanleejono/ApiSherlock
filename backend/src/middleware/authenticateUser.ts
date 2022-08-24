import jwt from "jsonwebtoken";
import { unAuthenticatedError } from "errors/index";
import { Request, Response, NextFunction } from "express";

interface JwtPayload {
  userId: string;
}

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

  const accessToken = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      accessToken,
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
