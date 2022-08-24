import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

const getCurrentUserId = async (accessToken: string) => {
  try {
    const payload = jwt.verify(
      accessToken,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const currentUserId = payload.userId;

    return currentUserId;
  } catch (err) {
    return { error: err };
  }
};

export default getCurrentUserId;
