import jwt from "jsonwebtoken";
import { JwtPayload } from "interfaces/jwtPayload";

const getCurrentUserId = async (accessToken: string) => {
  const payload = jwt.verify(
    accessToken,
    process.env.JWT_SECRET as string
  ) as JwtPayload;

  const currentUserId = payload.userId;

  return currentUserId;
};

export default getCurrentUserId;
