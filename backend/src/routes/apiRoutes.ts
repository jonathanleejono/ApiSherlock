import {
  createApiUrl,
  deleteApiUrl,
  editApiUrl,
  getAllApisStatsUrl,
  getAllApisUrl,
  getApiUrl,
  pingAllApisUrl,
  pingOneApiUrl,
} from "constants/apiUrls";
import {
  createApi,
  deleteApi,
  getAllApis,
  getApi,
  showStats,
  updateApi,
} from "controllers/apiController";
import { pingAll, pingOne } from "controllers/pingController";
import { Response, Router } from "express";
import rateLimiter from "express-rate-limit";
import { apiValidator } from "middleware/validator/apiValidator";
import { validateResult } from "middleware/validator/validateResult";

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
router
  .route(`${createApiUrl}`)
  .post(
    createRateLimiter(15, 10),
    apiValidator(`${createApiUrl}`),
    validateResult,
    createApi
  );

router
  .route(`${getAllApisUrl}`)
  .get(apiValidator(`${getAllApisUrl}`), validateResult, getAllApis);

router.route(`${getAllApisStatsUrl}`).get(showStats);

router
  .route(`${editApiUrl}/:id`)
  .patch(apiValidator(`${editApiUrl}`), validateResult, updateApi);

router
  .route(`${deleteApiUrl}/:id`)
  .delete(createRateLimiter(15, 10), deleteApi);

router.route(`${getApiUrl}/:id`).get(getApi);

router.route(`${pingAllApisUrl}`).post(createRateLimiter(15, 10), pingAll);

router.route(`${pingOneApiUrl}/:id`).post(createRateLimiter(15, 10), pingOne);

export default router;
