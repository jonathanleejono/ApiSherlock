import jwt from "jsonwebtoken";

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
  } catch (err) {
    return { error: err };
  }
};

export default getCurrentUserId;
