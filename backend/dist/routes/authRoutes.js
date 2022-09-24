"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrls_1 = require("constants/apiUrls");
const envVars_1 = require("constants/envVars");
const authController_1 = require("controllers/authController");
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const authenticateUser_1 = __importDefault(require("middleware/authenticateUser"));
const authValidator_1 = require("middleware/validator/authValidator");
const validateResult_1 = require("middleware/validator/validateResult");
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
const maxRequests = envVars_1.PROD_ENV ? 5 : 30;
router
    .route(`${apiUrls_1.registerUserUrl}`)
    .post(createRateLimiter(15, maxRequests), (0, authValidator_1.authValidator)(`${apiUrls_1.registerUserUrl}`), validateResult_1.validateResult, authController_1.register);
router
    .route(`${apiUrls_1.loginUserUrl}`)
    .post(createRateLimiter(15, maxRequests), (0, authValidator_1.authValidator)(`${apiUrls_1.loginUserUrl}`), validateResult_1.validateResult, authController_1.login);
router
    .route(`${apiUrls_1.authUserUrl}`)
    .patch(createRateLimiter(15, maxRequests), authenticateUser_1.default, (0, authValidator_1.authValidator)(`${apiUrls_1.authUserUrl}`), validateResult_1.validateResult, authController_1.updateUser)
    .get(createRateLimiter(15, maxRequests), authenticateUser_1.default, authController_1.getAuthUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map