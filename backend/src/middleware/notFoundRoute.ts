import { NextFunction, Request, Response } from "express";

const notFoundMiddleware = (_: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: "Route does not exist" });
  next();
  return;
};

export default notFoundMiddleware;
