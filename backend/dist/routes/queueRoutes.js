"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apiUrls_1 = require("constants/apiUrls");
const queueController_1 = require("controllers/queueController");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
dotenv_1.default.config();
const router = (0, express_1.Router)();
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
const rateLimitRequests = process.env.NODE_ENV === "production" ? 2 : 10;
router
    .route(`${apiUrls_1.handleQueueUrl}`)
    .post(createRateLimiter(15, rateLimitRequests), queueController_1.startQueue)
    .delete(createRateLimiter(15, rateLimitRequests), queueController_1.removeQueue);
exports.default = router;
//# sourceMappingURL=queueRoutes.js.map