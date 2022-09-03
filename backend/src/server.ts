import { pingHealthCheckSuccessMsg } from "constants/messages";
import {
  baseApiUrl,
  baseAuthUrl,
  baseMonitorUrl,
  baseQueueUrl,
  baseSeedDbUrl,
  pingHealthCheckUrl,
} from "constants/urls";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "db/connect";
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

//throws error if env variable is missing
cleanEnv(process.env, {
  JWT_SECRET: validateStr(),
  REDIS_PORT: port(),
});

if (process.env.NODE_ENV !== "production") {
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

if (process.env.NODE_ENV === "test") {
  app.use(`${baseSeedDbUrl}`, seedDbRouter);
}

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

let serverPort: number;

function setServerPort(inputPort: number) {
  serverPort = inputPort;
}

(async () => {
  setServerPort(await getPort({ port: 5000 }));
})();

function getServerPort(): number {
  return serverPort;
}

const server = app.listen(getServerPort(), () => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`Server is listening on port ${getServerPort()}...`);
  }
});

const initDB = async () => {
  try {
    if (process.env.NODE_ENV !== "test") {
      await connectDB(process.env.MONGO_URL as string);
    }
  } catch (error) {
    console.log(error);
  }
};

initDB();

export const closeServer = () => {
  server.close();
};

export default app;
