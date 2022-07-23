import jwt from "jsonwebtoken";
import { UnAuthenticatedError } from "../errors/index";

interface JwtPayload {
  userId: string;
}

const getCurrentUserId = async (token: string) => {
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const currentUserId = payload.userId;

    return currentUserId;
  } catch (error) {
    throw new UnAuthenticatedError("Authentication Invalid");
  }
};

export default getCurrentUserId;
