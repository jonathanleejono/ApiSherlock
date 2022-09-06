import { handleQueueUrl } from "constants/apiUrls";
import { removeQueue, startQueue } from "controllers/queueController";
import dotenv from "dotenv";
import { Response, Router } from "express";
import rateLimiter from "express-rate-limit";

dotenv.config();

const router = Router();

function createRateLimiter(minutes: number, maxRequests: number) {
  const _rateLimiter = rateLimiter({
    windowMs: minutes * 60 * 1000,
    max: maxRequests,
    handler: (_, res: Response) => {
      res.status(429).json({
        msg: `Too many requests from this IP, please try again after ${minutes} minutes`,
      });
    },
  });

  return _rateLimiter;
}

const rateLimitRequests = process.env.NODE_ENV === "production" ? 2 : 10;

router
  .route(`${handleQueueUrl}`)
  .post(createRateLimiter(15, rateLimitRequests), startQueue)
  .delete(createRateLimiter(15, rateLimitRequests), removeQueue);

export default router;
