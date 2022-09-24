"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_ENV = exports.PROD_ENV = exports.REDIS_PASSWORD = exports.REDIS_USERNAME = exports.REDIS_PORT = exports.REDIS_HOST = exports.NODE_ENV = exports.JWT_ACCESS_TOKEN_LIFETIME = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
_a = process.env, exports.JWT_ACCESS_TOKEN_LIFETIME = _a.JWT_ACCESS_TOKEN_LIFETIME, exports.NODE_ENV = _a.NODE_ENV, exports.REDIS_HOST = _a.REDIS_HOST, exports.REDIS_PORT = _a.REDIS_PORT, exports.REDIS_USERNAME = _a.REDIS_USERNAME, exports.REDIS_PASSWORD = _a.REDIS_PASSWORD;
exports.PROD_ENV = exports.NODE_ENV === "production";
exports.TEST_ENV = exports.NODE_ENV === "test";
//# sourceMappingURL=envVars.js.map