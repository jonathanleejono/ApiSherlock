import express, { Response, Router } from "express";
import {
  login,
  refreshAccessToken,
  register,
  updateUser,
} from "controllers/authController";
import authenticateUser from "middleware/authenticateUser";
import rateLimiter from "express-rate-limit";
import {
  loginUserUrl,
  refreshAccessTokenUrl,
  registerUserUrl,
  updateUserUrl,
} from "constants/urls";

const router: Router = express.Router();

const registerLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  handler: (_, res: Response) => {
    res.status(429).json({
      msg: "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

const loginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  handler: (_, res: Response) => {
    res.status(429).json({
      msg: "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

router.route(`${registerUserUrl}`).post(registerLimiter, register);
router.route(`${loginUserUrl}`).post(loginLimiter, login);
router.route(`${updateUserUrl}`).patch(authenticateUser, updateUser);
router.route(`${refreshAccessTokenUrl}`).get(refreshAccessToken);

export default router;
