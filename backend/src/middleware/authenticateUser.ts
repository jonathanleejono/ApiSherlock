import { unAuthenticatedError } from "errors/index";
import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "interfaces/jwtPayload";
import jwt from "jsonwebtoken";

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    unAuthenticatedError(res, "Invalid credentials, please login again");
    return;
  }

  const accessToken = authHeader.split(" ")[1];

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
