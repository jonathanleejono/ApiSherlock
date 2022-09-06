"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrls_1 = require("constants/apiUrls");
const authController_1 = require("controllers/authController");
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authenticateUser_1 = __importDefault(require("middleware/authenticateUser"));
const expressValidator_1 = require("middleware/expressValidator");
const router = express_1.default.Router();
function createRateLimiter(minutes, maxRequests) {
    const _rateLimiter = (0, express_rate_limit_1.default)({
        windowMs: minutes * 60 * 1000,
        max: maxRequests,
        handler: (_, res) => {
            res.status(429).json({
                msg: `Too many requests from this IP, please try again after ${minutes} minutes`,
            });
        },
    });
    return _rateLimiter;
}
router
    .route(`${apiUrls_1.registerUserUrl}`)
    .post(createRateLimiter(15, 3), (0, expressValidator_1.createValidationFor)(`${apiUrls_1.registerUserUrl}`), expressValidator_1.checkValidationResult, authController_1.register);
router.route(`${apiUrls_1.loginUserUrl}`).post(createRateLimiter(15, 10), authController_1.login);
router
    .route(`${apiUrls_1.updateUserUrl}`)
    .patch(authenticateUser_1.default, (0, expressValidator_1.createValidationFor)(`${apiUrls_1.updateUserUrl}`), expressValidator_1.checkValidationResult, authController_1.updateUser);
router.route(`${apiUrls_1.refreshAccessTokenUrl}`).get(authController_1.refreshAccessToken);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map