import jwt from "jsonwebtoken";
import { unAuthenticatedError } from "errors/index";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "interfaces/jwtPayload";
import { cookieName } from "constants/cookies";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies[cookieName];

  if (!authHeader || !authHeader.startsWith("Bearer") || !refreshToken) {
    unAuthenticatedError(res, "Invalid credentials, please login again");
    return;
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const accessTokenPayload = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    jwt.verify(refreshToken, process.env.JWT_SECRET as string) as JwtPayload;

    req.user = { userId: accessTokenPayload.userId };

    next();
  } catch (error) {
    unAuthenticatedError(res, "Please login again");
    return;
  }
};

export default authenticateUser;
