import { Response } from "express";

const notFoundMiddleware = (res: Response) =>
  res.status(404).send("Route does not exist");

export default notFoundMiddleware;
