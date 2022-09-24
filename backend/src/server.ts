import {
  baseApiUrl,
  baseAuthUrl,
  baseMonitorUrl,
  baseQueueUrl,
  baseSeedDbUrl,
  pingHealthCheckUrl,
} from "constants/apiUrls";
import { PROD_ENV, TEST_ENV } from "constants/envVars";
import { pingHealthCheckSuccessMsg } from "constants/messages";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectMongoose from "db/connectMongoose";
import dotenv from "dotenv";
import { cleanEnv, makeValidator, port, str } from "envalid";
import express from "express";
import "express-async-errors";
import mongoSanitize from "express-mongo-sanitize";
import getPort from "get-port";
import helmet from "helmet";
import authenticateUser from "middleware/authenticateUser";
import errorHandlerMiddleware from "middleware/errorHandler";
import notFoundMiddleware from "middleware/notFoundRoute";
import morgan from "morgan";
import apiRouter from "routes/apiRoutes";
import authRouter from "routes/authRoutes";
import monitorRouter from "routes/monitorRoutes";
import queueRouter from "routes/queueRoutes";
import seedDbRouter from "routes/seedDbRoutes";
import xss from "xss-clean";

const app = express();

dotenv.config();

const validateStr = makeValidator((x) => {
  if (!x) throw new Error("Value is empty");
  else return str();
});

const validateEnv = makeValidator((x) => {
  if (!x) throw new Error("Value is empty");
  else
    return str({ choices: ["development", "test", "production", "staging"] });
});

const validateCI = makeValidator((x) => {
  if (!x) throw new Error("Value is empty");
  else return str({ choices: ["no", "yes"] });
});

//throws error if env variable is missing
cleanEnv(process.env, {
  MONGO_URL: validateStr(),
  JWT_SECRET: validateStr(),
  JWT_ACCESS_TOKEN_LIFETIME: validateStr(),
  NODE_ENV: validateEnv(),
  CORS_ORIGIN: validateStr(),
  REDIS_HOST: validateStr(),
  REDIS_PORT: port(),
  USING_CI: validateCI(),
});

if (PROD_ENV) {
  cleanEnv(process.env, {
    REDIS_USERNAME: validateStr(),
    REDIS_PASSWORD: validateStr(),
  });
}

if (!PROD_ENV) {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN as string],
    credentials: true,
  })
);

//make sure this is placed before routers
app.use(cookieParser());

app.use(pingHealthCheckUrl, (_, res) => {
  res.send(pingHealthCheckSuccessMsg);
});

app.use(`${baseAuthUrl}`, authRouter);
app.use(`${baseApiUrl}`, authenticateUser, apiRouter);
app.use(`${baseMonitorUrl}`, authenticateUser, monitorRouter);
app.use(`${baseQueueUrl}`, authenticateUser, queueRouter);

if (TEST_ENV) {
  app.use(`${baseSeedDbUrl}`, seedDbRouter);
}

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

let serverPort: number = parseInt(process.env.PORT as string) || 5000;

const start = async () => {
  try {
    //getPort chooses a different port if 5000 isn't available,
    //this prevents collisions during tests
    if (PROD_ENV) {
      serverPort = await getPort({ port: 5000 });
    }

    if (!TEST_ENV) {
      app.listen(serverPort, async () => {
        console.log(`Server is listening on port ${serverPort}...`);
      });

      // the tests have their individual db connections,
      // so the main connection isn't needed
      await connectMongoose(process.env.MONGO_URL as string);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error starting app");
  }
};

start();

export default app;
