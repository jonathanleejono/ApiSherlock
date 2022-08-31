import { Response, Router } from "express";
import rateLimiter from "express-rate-limit";

import { removeQueue, startQueue } from "controllers/queueController";

const router = Router();

function createRateLimiter(minutes: number, maxRequests: number) {
  const _rateLimiter = rateLimiter({
    windowMs: minutes * 60 * 1000,
    max: maxRequests,
    handler: (_, res: Response) => {
      res.status(429).json({
        msg: `Too many requests from this IP, 
        please try again after ${minutes} minutes`,
      });
    },
  });

  return _rateLimiter;
}

router
  .route(`/`)
  .post(createRateLimiter(15, 2), startQueue)
  .delete(createRateLimiter(15, 2), removeQueue);

export default router;
