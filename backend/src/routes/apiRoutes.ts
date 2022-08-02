import { Router } from "express";
import rateLimiter from "express-rate-limit";

import {
  createApi,
  deleteApi,
  getAllApis,
  updateApi,
  getApi,
  showStats,
} from "controllers/apiController";
import { pingAll, pingOne } from "controllers/pingController";
import {
  createApiUrl,
  deleteApiUrl,
  editApiUrl,
  getAllApisStatsUrl,
  getAllApisUrl,
  getApiUrl,
  pingAllApisUrl,
  pingOneApiUrl,
} from "constants/urls";

const router = Router();

const createLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  handler: (_, res) => {
    res.status(429).json({
      msg: "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

const pingLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  handler: (_, res) => {
    res.status(429).json({
      msg: "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

router.route(`${createApiUrl}`).post(createLimiter, createApi);
router.route(`${getAllApisUrl}`).get(getAllApis);
router.route(`${getAllApisStatsUrl}`).get(showStats);
router.route(`${deleteApiUrl}/:id`).delete(deleteApi);
router.route(`${editApiUrl}/:id`).patch(updateApi);
router.route(`${getApiUrl}/:id`).get(getApi);
router.route(`${pingAllApisUrl}`).post(pingLimiter, pingAll);
router.route(`${pingOneApiUrl}/:id`).post(pingLimiter, pingOne);

export default router;
