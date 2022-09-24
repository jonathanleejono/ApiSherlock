import { authUserUrl, loginUserUrl, registerUserUrl } from "constants/apiUrls";
import { PROD_ENV } from "constants/envVars";
import {
  getAuthUser,
  login,
  register,
  updateUser,
} from "controllers/authController";
import express, { Response, Router } from "express";
import rateLimiter from "express-rate-limit";
import authenticateUser from "middleware/authenticateUser";
import { authValidator } from "middleware/validator/authValidator";
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

const maxRequests = PROD_ENV ? 5 : 30;

router
  .route(`${registerUserUrl}`)
  .post(
    createRateLimiter(15, maxRequests),
    authValidator(`${registerUserUrl}`),
    validateResult,
    register
  );

router
  .route(`${loginUserUrl}`)
  .post(
    createRateLimiter(15, maxRequests),
    authValidator(`${loginUserUrl}`),
    validateResult,
    login
  );

//user shouldn't be able to access another user's profile,
//which is why authenticateUser is here
router
  .route(`${authUserUrl}`)
  .patch(
    createRateLimiter(15, maxRequests),
    authenticateUser,
    authValidator(`${authUserUrl}`),
    validateResult,
    updateUser
  )
  .get(createRateLimiter(15, maxRequests), authenticateUser, getAuthUser);

export default router;
