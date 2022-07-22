import dotenv from "dotenv";
import express from "express";

import "express-async-errors";

//HTTP request logger
import morgan from "morgan";

import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";

import { connectDB } from "./db/connect";

// routers
import usersRouter from "./routes/userRoutes";
import apiRouter from "./routes/apiRoutes";
import seedDbRouter from "./routes/seedDbRoutes";

// middleware
import authenticateUser from "./middleware/auth";
import errorHandlerMiddleware from "./middleware/error-handler";
import notFoundMiddleware from "./middleware/not-found";
import cors from "cors";

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

app.use("/api/ping", (_, res) => {
  res.send("hello world!");
});

app.use("/api/auth", usersRouter);
app.use("/api/api", authenticateUser, apiRouter);
app.use("/api/db", seedDbRouter);

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
