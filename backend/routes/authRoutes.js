import express from "express";
const router = express.Router();

import { register, login, updateUser } from "../controllers/authController.js";
import authenticateUser from "../middleware/auth.js";

import rateLimiter from "express-rate-limit";

const apiRegisterLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req, res) => {
    res.status(429).json({
      msg: "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

const apiLoginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req, res) => {
    res.status(429).json({
      msg: "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

router.route("/register").post(apiRegisterLimiter, register);
router.route("/login").post(apiLoginLimiter, login);
router.route("/updateUser").patch(authenticateUser, updateUser);

export default router;
