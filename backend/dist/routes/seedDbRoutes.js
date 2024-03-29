"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authenticateUser_1 = __importDefault(require("middleware/authenticateUser"));
const seedDB_1 = require("db/seedDB");
const apiUrls_1 = require("constants/apiUrls");
const router = express_1.default.Router();
router.route(`${apiUrls_1.resetMockUsersDbUrl}`).delete(seedDB_1.resetUsersCollection);
router.route(`${apiUrls_1.resetMockApisDbUrl}`).delete(seedDB_1.resetApiCollection);
router.route(`${apiUrls_1.resetMockMonitorDbUrl}`).delete(seedDB_1.resetMonitorCollection);
router.route(`${apiUrls_1.seedMockUsersDbUrl}`).post(seedDB_1.seedUsersCollection);
router.route(`${apiUrls_1.seedMockApisDbUrl}`).post(authenticateUser_1.default, seedDB_1.seedApiCollection);
exports.default = router;
//# sourceMappingURL=seedDbRoutes.js.map