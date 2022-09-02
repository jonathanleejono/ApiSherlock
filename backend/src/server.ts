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
import { cleanEnv, makeValidator } from "envalid";
import express from "express";
import "express-async-errors";
import mongoSanitize from "express-mongo-sanitize";
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

//throws error if env variable (value) is missing
const validateStr = makeValidator((x) => {
  if (!x) throw new Error("Value is empty");
});

//throws error if env variable (key) is missing
cleanEnv(process.env, {
  SECRET: validateStr(),
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

const serverPort = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL as string);
    if (process.env.NODE_ENV !== "test") {
      app.listen(serverPort, () => {
        console.log(`Server is listening on port ${serverPort}...`);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

start();

export default app;
