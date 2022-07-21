import express from "express";
import rateLimiter from "express-rate-limit";

import {
  createApi,
  deleteApi,
  getAllApis,
  updateApi,
  showStats,
  pingAll,
  pingOne,
} from "../controllers/apiController";

const router = express.Router();

const createLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  handler: (_, res) => {
    res.status(429).json({
      msg: "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

router.route("/").post(createLimiter, createApi).get(getAllApis);
router.route("/ping-all").post(pingAll);
router.route("/ping-one").post(pingOne);
router.route("/stats").get(showStats);
// remember about :id
router.route("/:id").delete(deleteApi).patch(updateApi);

export default router;
