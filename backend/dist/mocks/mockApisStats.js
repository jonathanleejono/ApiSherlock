"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockApisStats = void 0;
const moment_1 = __importDefault(require("moment"));
const currentMonthYear = (0, moment_1.default)().format("MMM YYYY");
exports.mockApisStats = {
    defaultStats: { healthy: 0, unhealthy: 0, pending: 5 },
    monthlyApis: [
        {
            date: `${currentMonthYear}`,
            count: 5,
        },
    ],
};
//# sourceMappingURL=mockApisStats.js.map