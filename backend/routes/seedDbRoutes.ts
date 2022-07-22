import express from "express";

import { resetDb, seedDb } from "../db/seedDb";

const router = express.Router();

router.route("/resetDb").delete(resetDb);
router.route("/seedDb").post(seedDb);

export default router;
