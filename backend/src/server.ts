import { pingHealthCheckSuccessMsg } from "constants/messages";
import {
  baseApiUrl,
  baseAuthUrl,
  baseSeedDbUrl,
  pingHealthCheckUrl,
} from "constants/urls";
import cors from "cors";
import connectDB from "db/connect";
import dotenv from "dotenv";
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
import seedDbRouter from "routes/seedDbRoutes";
import xss from "xss-clean";
import cookieParser from "cookie-parser";
// import session from "express-session";
// import connectRedis from "connect-redis";
// import Redis from "ioredis";

const app = express();
dotenv.config();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
// app.use(cors());

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN as string],
    credentials: true,
  })
);

//make sure this is placed before routers
app.use(cookieParser());

// const RedisStore = connectRedis(session);
// const redis = new Redis(process.env.REDIS_URL as string);

// app.set("trust proxy", process.env.NODE_ENV !== "production");

// app.use(
//   session({
//     name: "aid",
//     store: new RedisStore({ client: redis, disableTouch: true }),
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
//       httpOnly: true,
//       // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//       // secure: process.env.NODE_ENV === "production" ? true : false,
//       sameSite: "lax",
//       secure: false,
//     },
//     secret: process.env.SECRET as string,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

app.use(pingHealthCheckUrl, (_, res) => {
  res.send(pingHealthCheckSuccessMsg);
});

app.use(`${baseAuthUrl}`, authRouter);
app.use(`${baseApiUrl}`, authenticateUser, apiRouter);
app.use(`${baseSeedDbUrl}`, seedDbRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL as string);
    if (process.env.NODE_ENV !== "testing") {
      app.listen(port, () => {
        console.log(`Server is listening on port ${port}...`);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

start();

export default app;
