// no dotenv.config() needed
const { MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_PORT } = process.env;

//this is only used in testing with mongo containers
export const createDbUrl = (customDBName: string) =>
  `mongodb://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@localhost:${MONGODB_PORT}/${customDBName}?authMechanism=DEFAULT&authSource=admin`;
