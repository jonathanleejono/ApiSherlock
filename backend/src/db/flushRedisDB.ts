import connectRedisDB from "db/connectRedisDB";

const flushRedisDB = async () => {
  const redisConfiguration = await connectRedisDB();

  await redisConfiguration.connection.flushall();

  await redisConfiguration.connection.quit();

  //set timeout for connections to close properly to prevent memory leaks
  await new Promise((res) => setTimeout(res, 1000));
};

export default flushRedisDB;
