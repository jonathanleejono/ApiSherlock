import express, { Response, Router } from "express";
import {
  createMonitor,
  deleteMonitor,
  updateMonitor,
  activateMonitor,
} from "../controllers/monitorController";

import rateLimiter from "express-rate-limit";

const router: Router = express.Router();

const _rateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  handler: (_, res: Response) => {
    res.status(429).json({
      msg: "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

// the route path in server.ts is "/api/monitors"
router
  .route("/")
  .post(_rateLimiter, createMonitor)
  .patch(updateMonitor)
  .delete(deleteMonitor);
router.route("/activate").post(activateMonitor);

export default router;
