import {
  loginUserUrl,
  refreshAccessTokenUrl,
  registerUserUrl,
  updateUserUrl,
} from "constants/urls";
import {
  login,
  refreshAccessToken,
  register,
  updateUser,
} from "controllers/authController";
import express, { Response, Router } from "express";
import rateLimiter from "express-rate-limit";
import authenticateUser from "middleware/authenticateUser";
import {
  checkValidationResult,
  createValidationFor,
} from "middleware/expressValidator";

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
  .route(`${registerUserUrl}`)
  .post(
    createRateLimiter(15, 3),
    createValidationFor(`${registerUserUrl}`),
    checkValidationResult,
    register
  );

router.route(`${loginUserUrl}`).post(createRateLimiter(15, 10), login);

//user shouldn't be able to access another user's profile,
//which is why authenticateUser is here
router
  .route(`${updateUserUrl}`)
  .patch(
    authenticateUser,
    createValidationFor(`${updateUserUrl}`),
    checkValidationResult,
    updateUser
  );

//can't add authenticateUser middleware here, because user
//doesn't have an access token, so only cookies are validated
router.route(`${refreshAccessTokenUrl}`).get(refreshAccessToken);

export default router;
