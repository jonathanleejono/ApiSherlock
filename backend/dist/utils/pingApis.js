"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingApis = void 0;
const axios_1 = __importDefault(require("axios"));
const apis_1 = require("enum/apis");
const datetime_1 = require("./datetime");
async function pingApis(apis, user) {
    Object.keys(apis).forEach(async (_, index) => {
        const api = apis[index];
        axios_1.default
            .get(api.url)
            .then(() => {
            api.status = apis_1.ApiStatusOptions.HEALTHY;
            api.lastPinged = (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT);
            api.save();
        })
            .catch(() => {
            api.status = apis_1.ApiStatusOptions.UNHEALTHY;
            api.lastPinged = (0, datetime_1.getDateWithUTCOffset)(user.timezoneGMT);
            api.save();
        });
    });
}
exports.pingApis = pingApis;
//# sourceMappingURL=pingApis.js.map