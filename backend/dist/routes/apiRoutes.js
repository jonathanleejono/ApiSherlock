"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const apiController_1 = require("controllers/apiController");
const pingController_1 = require("controllers/pingController");
const urls_1 = require("constants/urls");
const router = (0, express_1.Router)();
function createRateLimiter(minutes, maxRequests) {
    const _rateLimiter = (0, express_rate_limit_1.default)({
        windowMs: minutes * 60 * 1000,
        max: maxRequests,
        handler: (_, res) => {
            res.status(429).json({
                msg: `Too many requests from this IP, 
        please try again after ${minutes} minutes`,
            });
        },
    });
    return _rateLimiter;
}
router.route(`${urls_1.createApiUrl}`).post(createRateLimiter(15, 10), apiController_1.createApi);
router.route(`${urls_1.getAllApisUrl}`).get(apiController_1.getAllApis);
router.route(`${urls_1.getAllApisStatsUrl}`).get(apiController_1.showStats);
router.route(`${urls_1.deleteApiUrl}/:id`).delete(apiController_1.deleteApi);
router.route(`${urls_1.editApiUrl}/:id`).patch(apiController_1.updateApi);
router.route(`${urls_1.getApiUrl}/:id`).get(apiController_1.getApi);
router.route(`${urls_1.pingAllApisUrl}`).post(createRateLimiter(15, 10), pingController_1.pingAll);
router.route(`${urls_1.pingOneApiUrl}/:id`).post(createRateLimiter(15, 10), pingController_1.pingOne);
exports.default = router;
//# sourceMappingURL=apiRoutes.js.map