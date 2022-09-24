"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrls_1 = require("constants/apiUrls");
const envVars_1 = require("constants/envVars");
const monitorController_1 = require("controllers/monitorController");
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const monitorValidator_1 = require("validator/monitorValidator");
const validateResult_1 = require("validator/validateResult");
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
const maxRequests = envVars_1.PROD_ENV ? 10 : 30;
router
    .route(`${apiUrls_1.handleMonitorUrl}`)
    .post(createRateLimiter(15, maxRequests), (0, monitorValidator_1.monitorValidator)({ create: true }), validateResult_1.validateResult, monitorController_1.createMonitor)
    .get(createRateLimiter(15, maxRequests), monitorController_1.getMonitor)
    .patch(createRateLimiter(15, maxRequests), (0, monitorValidator_1.monitorValidator)({ create: false }), validateResult_1.validateResult, monitorController_1.updateMonitor)
    .delete(createRateLimiter(15, maxRequests), monitorController_1.deleteMonitor);
exports.default = router;
//# sourceMappingURL=monitorRoutes.js.map