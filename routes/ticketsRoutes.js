import express from "express";
const router = express.Router();
import rateLimiter from "express-rate-limit";

import {
  createTicket,
  deleteTicket,
  getAllTickets,
  updateTicket,
  showStats,
} from "../controllers/ticketsController.js";

const apiCreateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
  handler: (req, res) => {
    res.status(429).json({
      msg: "Too many requests from this IP, please try again after 15 minutes",
    });
  },
});

router.route("/").post(apiCreateLimiter, createTicket).get(getAllTickets);
// remember about :id
router.route("/stats").get(showStats);
router.route("/:id").delete(deleteTicket).patch(updateTicket);

export default router;
