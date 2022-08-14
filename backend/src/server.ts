import {
  baseApiUrl,
  baseAuthUrl,
  baseSeedDbUrl,
  pingHealthCheckSuccessMsg,
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
import seedDbRouter from "routes/seedDbRoutes";
import usersRouter from "routes/userRoutes";
import xss from "xss-clean";

const app = express();
dotenv.config();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cors());

app.use(pingHealthCheckUrl, (_, res) => {
  res.send(pingHealthCheckSuccessMsg);
});

app.use(`${baseAuthUrl}`, usersRouter);
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
