import express from "express";
import authenticateUser from "middleware/authenticateUser";

import {
  resetApiCollection,
  resetMonitorCollection,
  resetUsersCollection,
  seedApiCollection,
  seedUsersCollection,
} from "db/seedDB";

import {
  resetMockApisDbUrl,
  resetMockMonitorDbUrl,
  resetMockUsersDbUrl,
  seedMockApisDbUrl,
  seedMockUsersDbUrl,
} from "constants/apiUrls";

const router = express.Router();

router.route(`${resetMockUsersDbUrl}`).delete(resetUsersCollection);
router.route(`${resetMockApisDbUrl}`).delete(resetApiCollection);
router.route(`${resetMockMonitorDbUrl}`).delete(resetMonitorCollection);
router.route(`${seedMockUsersDbUrl}`).post(seedUsersCollection);

// the authenticateUser is needed to grab current user id, which
// is inserted in the createdBy field for the created api objects
router.route(`${seedMockApisDbUrl}`).post(authenticateUser, seedApiCollection);

export default router;
