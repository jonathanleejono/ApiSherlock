import {
  PROD_ENV,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME,
} from "constants/envVars";
import Redis from "ioredis";

const connectRedisDB = async () => {
  const redisConfiguration = {
    connection: new Redis({
      host: REDIS_HOST as string,
      port: parseInt(REDIS_PORT as string),
      username: PROD_ENV ? (REDIS_USERNAME as string) : undefined,
      password: PROD_ENV ? (REDIS_PASSWORD as string) : undefined,
      maxRetriesPerRequest: null,
    }),
  };

  return redisConfiguration;
};

export default connectRedisDB;
