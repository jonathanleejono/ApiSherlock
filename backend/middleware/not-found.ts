import { Response } from "express";

const notFoundMiddleware = (_, res: Response) =>
  res.status(404).send("Route does not exist");

export default notFoundMiddleware;
