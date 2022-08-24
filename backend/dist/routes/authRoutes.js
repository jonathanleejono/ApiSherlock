"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("controllers/authController");
const authenticateUser_1 = __importDefault(require("middleware/authenticateUser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const urls_1 = require("constants/urls");
const router = express_1.default.Router();
const registerLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    handler: (_, res) => {
        res.status(429).json({
            msg: "Too many requests from this IP, please try again after 15 minutes",
        });
    },
});
const loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 10,
    handler: (_, res) => {
        res.status(429).json({
            msg: "Too many requests from this IP, please try again after 15 minutes",
        });
    },
});
router.route(`${urls_1.registerUserUrl}`).post(registerLimiter, authController_1.register);
router.route(`${urls_1.loginUserUrl}`).post(loginLimiter, authController_1.login);
router.route(`${urls_1.updateUserUrl}`).patch(authenticateUser_1.default, authController_1.updateUser);
router.route(`${urls_1.refreshAccessTokenUrl}`).get(authController_1.refreshAccessToken);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map