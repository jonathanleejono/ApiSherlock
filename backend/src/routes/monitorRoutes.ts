import { handleMonitorUrl } from "constants/apiUrls";
import { PROD_ENV } from "constants/envVars";
import {
  createMonitor,
  deleteMonitor,
  getMonitor,
  updateMonitor,
} from "controllers/monitorController";
import express, { Response, Router } from "express";
import rateLimiter from "express-rate-limit";
import { monitorValidator } from "middleware/validator/monitorValidator";
import { validateResult } from "middleware/validator/validateResult";

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

const maxRequests = PROD_ENV ? 10 : 30;

router
  .route(`${handleMonitorUrl}`)
  .post(
    createRateLimiter(15, maxRequests),
    monitorValidator({ create: true }),
    validateResult,
    createMonitor
  )
  .get(createRateLimiter(15, maxRequests), getMonitor)
  .patch(
    createRateLimiter(15, maxRequests),
    monitorValidator({ create: false }),
    validateResult,
    updateMonitor
  )
  .delete(createRateLimiter(15, maxRequests), deleteMonitor);

export default router;
