import express from "express";
import authenticateUser from "../middleware/auth";

import {
  resetUsersCollection,
  resetApiCollection,
  seedUsersCollection,
  seedApiCollection,
} from "../db/seedDb";

const router = express.Router();

const resetDb = "/resetDb";
const seedDb = "/seedDb";

router.route(`${resetDb}/users`).delete(resetUsersCollection);
router.route(`${resetDb}/api`).delete(resetApiCollection);
router.route(`${seedDb}/users`).post(seedUsersCollection);
// the authenticateUser is needed to grab current user id, which
// is inserted in the createdBy field for the created api objects
router.route(`${seedDb}/api`).post(authenticateUser, seedApiCollection);

export default router;
