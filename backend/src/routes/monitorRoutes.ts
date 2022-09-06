import { handleMonitorUrl } from "constants/apiUrls";
import {
  createMonitor,
  deleteMonitor,
  getMonitor,
  updateMonitor,
} from "controllers/monitorController";
import express, { Response, Router } from "express";
import rateLimiter from "express-rate-limit";

const router: Router = express.Router();

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

router
  .route(`${handleMonitorUrl}`)
  .post(createRateLimiter(15, 10), createMonitor)
  .get(getMonitor)
  .patch(updateMonitor)
  .delete(deleteMonitor);

export default router;
