"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateUser_1 = __importDefault(require("middleware/authenticateUser"));
const seedDb_1 = require("db/seedDb");
const urls_1 = require("constants/urls");
const router = express_1.default.Router();
router.route(`${urls_1.resetMockUsersDbUrl}`).delete(seedDb_1.resetUsersCollection);
router.route(`${urls_1.resetMockApisDbUrl}`).delete(seedDb_1.resetApiCollection);
router.route(`${urls_1.resetMockMonitorDbUrl}`).delete(seedDb_1.resetMonitorCollection);
router.route(`${urls_1.seedMockUsersDbUrl}`).post(seedDb_1.seedUsersCollection);
router.route(`${urls_1.seedMockApisDbUrl}`).post(authenticateUser_1.default, seedDb_1.seedApiCollection);
exports.default = router;
//# sourceMappingURL=seedDbRoutes.js.map