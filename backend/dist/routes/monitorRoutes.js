"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrls_1 = require("constants/apiUrls");
const monitorController_1 = require("controllers/monitorController");
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
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
    .route(`${apiUrls_1.handleMonitorUrl}`)
    .post(createRateLimiter(15, 10), monitorController_1.createMonitor)
    .get(monitorController_1.getMonitor)
    .patch(monitorController_1.updateMonitor)
    .delete(monitorController_1.deleteMonitor);
exports.default = router;
//# sourceMappingURL=monitorRoutes.js.map