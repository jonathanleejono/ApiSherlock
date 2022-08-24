"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieHttpOnlySetting = exports.cookieSameSiteSetting = exports.cookieSecureSetting = exports.cookieExpiryTime = exports.cookieName = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PROD_ENV = process.env.NODE_ENV === "production";
exports.cookieName = "apiSherlockId";
exports.cookieExpiryTime = 1000 * 60 * 60 * 24;
exports.cookieSecureSetting = PROD_ENV ? true : false;
exports.cookieSameSiteSetting = PROD_ENV ? "none" : "lax";
exports.cookieHttpOnlySetting = PROD_ENV ? true : false;
//# sourceMappingURL=cookies.js.map