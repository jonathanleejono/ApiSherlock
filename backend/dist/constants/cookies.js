"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieHttpOnlySetting = exports.cookieSameSiteSetting = exports.cookieSecureSetting = exports.cookieExpiryTime = exports.cookieName = void 0;
const envVars_1 = require("constants/envVars");
exports.cookieName = "apiSherlockId";
exports.cookieExpiryTime = 1000 * 60 * 60 * 24;
exports.cookieSecureSetting = envVars_1.PROD_ENV ? true : false;
exports.cookieSameSiteSetting = envVars_1.PROD_ENV ? "none" : "lax";
exports.cookieHttpOnlySetting = envVars_1.PROD_ENV ? true : false;
//# sourceMappingURL=cookies.js.map