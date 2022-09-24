import dotenv from "dotenv";

dotenv.config();

export const {
  JWT_ACCESS_TOKEN_LIFETIME,
  NODE_ENV,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
} = process.env;

export const PROD_ENV = NODE_ENV === "production";
export const TEST_ENV = NODE_ENV === "test";
