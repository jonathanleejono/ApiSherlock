import { cookieName } from "constants/cookies";
import { unAuthenticatedError } from "errors/index";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "interfaces/jwtPayload";
import jwt from "jsonwebtoken";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies[cookieName];

  if (!accessToken) {
    unAuthenticatedError(res, "Invalid credentials, please login again");
    return;
  }

  // don't split authheader for cookies

  try {
    const accessTokenPayload = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    jwt.verify(accessToken, process.env.JWT_SECRET as string) as JwtPayload;

    req.user = { userId: accessTokenPayload.userId };

    next();
  } catch (error) {
    unAuthenticatedError(res, "Error in credentials, please login again");
    return;
  }
};

export default authenticateUser;
