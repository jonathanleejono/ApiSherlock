"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersController_1 = require("controllers/usersController");
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
router.route(`${urls_1.registerUserUrl}`).post(registerLimiter, usersController_1.register);
router.route(`${urls_1.loginUserUrl}`).post(loginLimiter, usersController_1.login);
router.route(`${urls_1.updateUserUrl}`).patch(authenticateUser_1.default, usersController_1.updateUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map